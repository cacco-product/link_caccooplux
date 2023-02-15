/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable require-jsdoc */

'use strict';

var Calendar = require('dw/util/Calendar');
var StringUtils = require('dw/util/StringUtils');
var Transaction = require('dw/system/Transaction');
var Order = require('dw/order/Order');
var OPLUX_LOGGER = require('dw/system/Logger').getLogger('OPLUX', 'O-PLUX');
var constants = require('*/cartridge/scripts/utils/constants');
var eventHelpers = require('*/cartridge/scripts/utils/eventHelpers');
var opluxServices = require('*/cartridge/scripts/utils/opluxServices');
var opluxCallHelpers = require('*/cartridge/scripts/utils/opluxCallHelpers');

/**
 * Call OPLUX event registration API
 * @param {Object} order - SFCC order object
 * @param {Object} extraRaw - The json object contains additional information
 * @returns {Object} result - dw.svc.Result Result of the API call, or null if the call failed
 */
function eventRegistration(order, extraRaw) {
    OPLUX_LOGGER.info('[Helpers] eventRegistration() START');
    var result;
    try {
        // get normalizedNames
        var normalizedNames = opluxCallHelpers.getNormalizedNames(order);

        // call registerEvent API
        result = opluxServices.registerEvent(order, normalizedNames, extraRaw);
    } catch (e) {
        OPLUX_LOGGER.error('[Helpers] eventRegistration ERROR: {0}', e.message);
    }

    OPLUX_LOGGER.info('[Helpers] eventRegistration() END');
    return result;
}

/**
 * Handle result of event registration API
 * @param {Object} order
 * @param {Object} opluxResult
 * @param {Object} extraRaw
 * @returns {Object}
 */
function eventRegistrationResultHandler(order, opluxResult, extraRaw) {
    return eventHelpers.eventRegistrationResultHandler(order, opluxResult, extraRaw);
}

/**
 * Call OPLUX API and update event information
 * @param {string} eventId
 * @param {Object} extraRaw
 * @returns {Object} result
 */
 function updateEventInfo(eventId, extraRaw) {
    OPLUX_LOGGER.info('[Helpers] updateEventInfo() START');
    var result;

    try {
        result = opluxServices.updateEventInfo(eventId, extraRaw);
    } catch (e) {
        OPLUX_LOGGER.error('[Helpers] updateEventInfo() ERROR: {0}', e.message);
    }

    OPLUX_LOGGER.info('[Helpers] updateEventInfo() END');
    return result;
}

/**
 * Handle result of OPLUX event update API
 * @param {Object} order
 * @param {Object} opluxResult
 * @param {Object} params
 * @returns {Object} resObj
 */
 function eventUpdateResultHandler(order, opluxResult, params) {
    if (order === null || opluxResult === null) {
        OPLUX_LOGGER.error('[Helpers] eventUpdateResultHandler() order or opluxResult is null');
        return;
    }

    var currentCalendar = Calendar(new Date());
    currentCalendar.setTimeZone('Japan');
    var currentDate = StringUtils.formatCalendar(currentCalendar, 'YYYY/MM/dd HH:mm:ss');
    var resObj; var
        errorMsg;
    var responseResult = constants.RESPONSE_RESULT.ERROR;

    try {
        OPLUX_LOGGER.debug('[Helpers] eventUpdateResultHandler() START');
        if (opluxResult.isOk()) {
            var data = eventHelpers.parseToXML(opluxResult.getObject());
            responseResult = data.result.toString();
            if (responseResult === constants.RESPONSE_RESULT.OK) { // success
                // update oplux status to order object
                Transaction.wrap(function () {
                    if (!empty(params.get('status').getValue())) {
                        order.custom.oplux_event_ma_result = params.get('status').getValue().toString();
                    }
                    if (!empty(params.get('maMemo').getValue())) {
                        order.custom.oplux_event_ma_result_memo = params.get('maMemo').getValue();
                    }
                    if (!empty(params.get('blackStatus').getValue())) {
                        order.custom.oplux_blacked_flag = params.get('blackStatus').getValue().toString() === '1';
                        order.custom.oplux_black_customer_type = params.get('blackStatus').getValue().toString() === '1' ? params.get('customerType').getValue() : '';
                        order.custom.oplux_black_settle_category = params.get('settleCategory').getValue();
                        order.custom.oplux_black_other_category = params.get('otherCategory').getValue();
                    }
                });
            } else {
                var errors = data.errors[0].error;
                for (var j = 0; j < errors.length(); j++) {
                    var error = errors[j];
                    errorMsg += error.code + '・' + error.message;
                    errorMsg += j !== errors.length() - 1 ? '／' : '';
                }
                OPLUX_LOGGER.debug('[Helpers] eventUpdateResultHandler() error message: {0}', errorMsg);
                errorMsg = '[' + currentDate + '] ' + errorMsg;
            }
        } else {
            errorMsg = eventHelpers.parseToXML(opluxResult.getErrorMessage());
            if (errorMsg) {
                errorMsg = '[' + currentDate + '] ' + errorMsg.errors.error.message;
            } else {
                errorMsg = '[' + currentDate + '] ' + opluxResult.getError() + ': ' + opluxResult.getMsg();
            }
        }

        if (!empty(errorMsg)) {
            Transaction.wrap(function () {
                order.custom.oplux_error = errorMsg;
            });
        }
    } catch (e) {
        OPLUX_LOGGER.error('[Helpers] eventUpdateResultHandler error: {0}', e.message);
        errorMsg = '[' + currentDate + '] ' + e.message;
    }

    if (responseResult === constants.RESPONSE_RESULT.OK) {
        resObj = {
            success: true,
            responseResult: responseResult,
            orderStatus: order.status.toString()
        };
    } else {
        resObj = {
            success: false,
            responseResult: responseResult,
            errorMsg: errorMsg
        };
    }
    OPLUX_LOGGER.debug('[Helpers] eventUpdateResultHandler() END');
    // eslint-disable-next-line consistent-return
    return resObj;
}

/**
 * Handle export status and confirm status of order after call OPLUX event registration API or event update API
 * @param {Object} order
 * @returns {undefined}
 */
 function orderStatusHandler(order) {
    var OrderMgr = require('*/cartridge/scripts/opluxOrderMgr');
    var Constants = require('*/cartridge/scripts/utils/constants');
    var maResult = order.custom.oplux_event_ma_result.value;
    var aaResult = order.custom.oplux_event_aa_result.value;
    var stt = !empty(maResult) ? maResult : aaResult;
    var exportStatus = order.getExportStatus().value;

    if (!empty(stt) && exportStatus !== Order.EXPORT_STATUS_EXPORTED) {
        OPLUX_LOGGER.debug('[Helpers] orderStatusHandler() START');
        if (Constants.EVENT_STATUS.OK.equalsIgnoreCase(stt) && order.exportStatus.value === Order.EXPORT_STATUS_NOTEXPORTED && order.confirmationStatus.value === Order.CONFIRMATION_STATUS_NOTCONFIRMED) {
            Transaction.wrap(function () {
                order.setExportStatus(Order.EXPORT_STATUS_READY);
                order.setConfirmationStatus(Order.CONFIRMATION_STATUS_CONFIRMED);
            });
        } else if (Constants.EVENT_STATUS.NG.equalsIgnoreCase(stt) && order.status !== Order.ORDER_STATUS_CANCELLED) {
            OrderMgr.cancelOrder(order);
        } else if (Constants.EVENT_STATUS.HOLD.equalsIgnoreCase(stt) || Constants.EVENT_STATUS.REVIEW.equalsIgnoreCase(stt)) {
            Transaction.wrap(function () {
                order.setExportStatus(Order.EXPORT_STATUS_NOTEXPORTED);
                order.setConfirmationStatus(Order.CONFIRMATION_STATUS_NOTCONFIRMED);
            });
        }
    }
}

module.exports = {
    eventRegistration: eventRegistration,
    eventRegistrationResultHandler: eventRegistrationResultHandler,
    updateEventInfo: updateEventInfo,
    eventUpdateResultHandler: eventUpdateResultHandler,
    orderStatusHandler: orderStatusHandler
};
