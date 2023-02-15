'use strict';
/**
 * Helper that sends an email to a customer. This will only get called if hook handler is not registered
 * @param {Object} emailObj - An object that contains information about email that will be sent
 * @param {string} emailObj.to - Email address to send the message to (required)
 * @param {string} emailObj.subject - Subject of the message to be sent (required)
 * @param {string} emailObj.from - Email address to be used as a "from" address in the email (required)
 * @param {int} emailObj.type - Integer that specifies the type of the email being sent out. See export from emailHelpers for values.
 * @param {string} template - Location of the ISML template to be rendered in the email.
 * @param {Object} context - Object with context to be passed as pdict into ISML template.
 * @returns {undefined}
 */
function send(emailObj, template, context) {
    var Mail = require('dw/net/Mail');
    var StringUtils = require('dw/util/StringUtils');
    var renderTemplateHelper = require('~/cartridge/scripts/utils/renderTemplateHelper');

    var email = new Mail();
    email.addTo(emailObj.to);
    email.setSubject(emailObj.subject);
    email.setFrom(emailObj.from);
    var content = renderTemplateHelper.getRenderedHtml(context, template);
    email.setContent(StringUtils.decodeString(content, StringUtils.ENCODE_TYPE_HTML), 'text/html', 'UTF-8');
    email.send();
}

/**
 * Send content email
 * @param {string} to Send to
 * @param {string} contentName The email content
 * @param {Object} contentData Replace content data
 * @param {string} subject The email subject
 * @returns {undefined}
 */
function sendContentEmail(to, contentName, contentData, subject) {
    var contentHelpers = require('~/cartridge/scripts/utils/contentHelpers');
    var Site = require('dw/system/Site');
    var Resource = require('dw/web/Resource');
    var body = contentHelpers.getReplaceContent(contentName, contentData);
    var from = Site.current.getCustomPreferenceValue('customerServiceEmail') || Resource.msg('global.email', 'oplux', null);

    if (subject == null) {
        subject = contentHelpers.getEmailTitle(contentName);
    }

    var emailObj = {
        to: to,
        subject: subject,
        from: from
    };

    send(emailObj, 'email/orderCancelledEmail', { content: body });
}

/**
 * Send Oplux email notification
 * @param {Object} dw.order.Order order - The current order
 * @param {string} subject The email subject
 * @returns {undefined}
 */
function sendCancelEmail(order, subject) {
    if (order && !order.custom.oplux_customer_notification_mail_sent_flag) {
        var Transaction = require('dw/system/Transaction');
        var email = order.customerEmail;
        var contentData = {
            customerName: order.getCustomerName(),
            orderNumber: order.getOrderNo(),
            amountRefund: order.getTotalGrossPrice().getValue()
        };

        sendContentEmail(email, 'opluxCancelledEmail', contentData, subject);

        Transaction.wrap(function () {
            order.custom.oplux_customer_notification_mail_sent_flag = true;
        });
    }
}

module.exports = {
    sendCancelEmail: sendCancelEmail
};
