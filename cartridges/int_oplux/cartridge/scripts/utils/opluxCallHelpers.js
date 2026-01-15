'use strict';

var Transaction = require('dw/system/Transaction');
var OPLUX_LOGGER = require('dw/system/Logger').getLogger('OPLUX', 'O-PLUX');
var OpluxServices = require('*/cartridge/scripts/utils/opluxServices');
var EventHelpers = require('*/cartridge/scripts/utils/eventHelpers');
var Constants = require('*/cartridge/scripts/utils/constants');

/**
 * Call OPLUX Name normalization API
 * @param {Object} order - order object.
 * @returns {undefined}
 */
function getNormalizedNames(order) {
    // Name Normalize
    var buyerFirstName = order.billingAddress.firstName;
    var buyerLastName = order.billingAddress.lastName;
    var buyerLastNameKana = order.billingAddress.custom.oplux_last_name_kana;
    var deliveryFirstName = order.defaultShipment.shippingAddress.firstName;
    var deliveryLastName = order.defaultShipment.shippingAddress.lastName;
    var deliveryLastNameKana = order.defaultShipment.shippingAddress.custom.oplux_last_name_kana;
    var normalizedNames = {};

    var buyer = OpluxServices.getNormalizedName(buyerFirstName, buyerLastName, buyerLastNameKana).getObject();
    var delivery = OpluxServices.getNormalizedName(deliveryFirstName, deliveryLastName, deliveryLastNameKana).getObject();

    if (buyer) {
        normalizedNames.buyer = JSON.parse(buyer).response;
    }
    if (delivery) {
        normalizedNames.delivery = JSON.parse(delivery).response;
    }

    return normalizedNames;
}

/**
 * Validate OPLUX result after event regist
 * @param {Object} basket
 * @returns {boolean} isValid
 */
 function opluxResultValidation(basket) {
    var aaResult = basket.custom.oplux_event_aa_result.value ? basket.custom.oplux_event_aa_result.value.toUpperCase() : '';
    var responseResult = basket.custom.oplux_response_result.value;
    // `Constants.ORDER_STATUS_FOR_ERROR` is set to what the order status should be when an API request fails.
    var shouldBeFailedOrderStatusWhenApiFailed = Constants.ORDER_STATUS_FOR_ERROR.value === 'FAILED';
    // `Constants.ORDER_STATUS_FOR_REVIEW` is set to what the order status when the API review result is REVIEW or HOLD.
    var shouldBeFailedOrderStatusWhenApiResultReviewOrHold = Constants.ORDER_STATUS_FOR_REVIEW.value === 'FAILED';
    var isValid = true;

    if (Constants.RESPONSE_RESULT.ERROR === responseResult && shouldBeFailedOrderStatusWhenApiFailed) {
        isValid = false;
    }

    if (Constants.EVENT_STATUS.NG === aaResult) {
        isValid = false;
    } else if (Constants.EVENT_STATUS.HOLD === aaResult || Constants.EVENT_STATUS.REVIEW === aaResult) {
        if (shouldBeFailedOrderStatusWhenApiResultReviewOrHold) {
            isValid = false;
        }
    }

    return isValid;
}

/**
 * Description of the function
 * @param {Object} basket - dw.order.Basket
 * @returns {Object} result
 * @returns {boolean} result.pass - boolean,Is order processing will continue(true) or stop(false).
 * @returns {string} result.error - Error message.
 * @returns {Object} result.response - Response of registerEvent API.
 */
function checkOplux(basket, extraReqObj) {
    var result = {
        pass: true
    };

    try {
        if (!basket) {
            throw Error('[checkOplux] order is required.');
        }

        // Name normalization
        var normalizedNames = getNormalizedNames(basket);

        // Device information
        var extraRaw = { telegram:{event: {}} };
        var deviceInfo = session.getPrivacy().opluxDeviceInfo;
        if (!empty(deviceInfo)) {
            extraRaw.telegram.event.device_info = deviceInfo;
        }
        extraRaw.telegram.event.ip_address_only = request.getHttpRemoteAddress().toString();
        if (extraReqObj) {
            extraRaw = EventHelpers.merge(extraRaw, extraReqObj);
        }

        // Event registration
        var eventResult = OpluxServices.registerEvent(basket, normalizedNames, extraRaw);
        result.response = EventHelpers.eventRegistrationResultHandler(basket, eventResult, extraRaw);
    } catch (e) {
        OPLUX_LOGGER.error('[OPLUX] CheckOplux\n{0}', e);
        Transaction.wrap(function () {
            basket.custom.oplux_response_result = Constants.RESPONSE_RESULT.ERROR;
            basket.custom.oplux_error = e.message;
        });
        result.error = e.message;
    }

    result.pass = opluxResultValidation(basket);
    return result;
}

/**
 * Update export status and confirm status of SFCC order
 * @param {Object} order
 * @returns {undefined}
 */
function postProcess(order) {
    // set order status for order need stopping export order process.
    var aaResult = order.custom.oplux_event_aa_result.value ? order.custom.oplux_event_aa_result.value.toUpperCase() : '';
    var responseResult = order.custom.oplux_response_result.value;
    // `Constants.ORDER_STATUS_FOR_ERROR` is set to what the order status should be when an API request fails.
    var shouldBeOnHoldOrderStatusWhenApiFailed = Constants.ORDER_STATUS_FOR_ERROR.value === 'HOLD';
    // `Constants.ORDER_STATUS_FOR_REVIEW` is set to what the order status when the API review result is REVIEW or HOLD.
    var shouldBeOnHoldOrderStatusWhenApiResultReviewOrHold = Constants.ORDER_STATUS_FOR_REVIEW.value === 'HOLD';
    var isOnHold = false;

    if (Constants.RESPONSE_RESULT.ERROR === responseResult && shouldBeOnHoldOrderStatusWhenApiFailed) {
        isOnHold = true;
    }

    if (Constants.EVENT_STATUS.HOLD === aaResult || Constants.EVENT_STATUS.REVIEW === aaResult) {
        if (shouldBeOnHoldOrderStatusWhenApiResultReviewOrHold) {
            isOnHold = true;
        }
    }

    if (isOnHold) {
        Transaction.wrap(function () {
            order.setExportStatus(dw.order.Order.EXPORT_STATUS_NOTEXPORTED);
            order.setConfirmationStatus(dw.order.Order.CONFIRMATION_STATUS_NOTCONFIRMED);
        });
    }
}

module.exports = {
    getNormalizedNames: getNormalizedNames,
    opluxResultValidation: opluxResultValidation,
    checkOplux: checkOplux,
    postProcess: postProcess
};