'use strict';

/**
 * @module test\mock\int_oplux\cartridge\scripts\utils\mailHelpers.js
 */

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

module.exports = {
    requireMailHelpers: function () {
        return proxyquire(
            '../../../../../../cartridges/int_oplux/cartridge/scripts/utils/mailHelpers.js',
            {
                'dw/net/Mail': require('../../../../dw/dw.net.Mail'),
                'dw/util/StringUtils': require('../../../../dw/dw.util.StringUtils'),
                '~/cartridge/scripts/utils/renderTemplateHelper': require('./renderTemplateHelper'),
                '~/cartridge/scripts/utils/contentHelpers': require('./contentHelpers'),
                'dw/system/Site': require('../../../../dw/dw.system.Site'),
                'dw/web/Resource': require('../../../../dw/dw.web.Resource'),
                'dw/system/Transaction': require('../../../../dw/dw.system.Transaction')
            }
        );
    },
    order: {
        customerEmail: 'test@co.jp',
        custom: {
            oplux_customer_notification_mail_sent_flag: false
        },
        getCustomerName: function () {
            return '山田 太郎';
        },
        getOrderNo: function () {
            return '987';
        },
        getTotalGrossPrice: function () {
            return {
                getValue: function () {
                    return 1234;
                }
            };
        }
    }
};
