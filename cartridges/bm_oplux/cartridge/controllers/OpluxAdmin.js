/* eslint-disable no-plusplus */
/**
 * Description of the Controller and the logic it provides
 * @module  bm_oplux/cartridge/controllers/OpluxAdmin
 */
'use strict';

var OPLUX_LOGGER = require('dw/system/Logger').getLogger('OPLUX', 'O-PLUX');
/**
 * O-PLUX orderList show
 */
function show() {
    OPLUX_LOGGER.info('=====OPLUX show order list START=====');
    var ISML = require('dw/template/ISML');
    var PagingModel = require('dw/web/PagingModel');
    var opluxModels = require('~/cartridge/models/opluxModels');
    var filterParams = request.httpParameterMap;
    var selectedMenuItem = !empty(filterParams.SelectedMenuItem.value);
    var pageSize = filterParams.sz.intValue || 10;
    var start = filterParams.start.intValue || 0;
    var result = opluxModels.getOrders(filterParams);
    var orders = result.orders;
    var isOverSize = result.isOverSize;
    var orderPagingModel = new PagingModel(orders);
    orderPagingModel.setPageSize(pageSize);
    orderPagingModel.setStart(start);

    var pdictObj = {
        CurrentMenuItemId: 'oplux_admin_mainmenu',
        MainmenuName: '不正検知設定',
        filterParams: filterParams,
        total: orders.getLength(),
        isOverSize: isOverSize,
        OrderPagingModel: orderPagingModel,
        selectedMenuItem: selectedMenuItem
    };

    ISML.renderTemplate('extensions/opluxAdmin', pdictObj);
}

/**
 * O-PLUX Re-review
 */
function eventReRegistration() {
    OPLUX_LOGGER.info('=====OPLUX eventReRegistration() START=====');
    var res = require('~/cartridge/scripts/utils/response');
    var helpers = require('~/cartridge/scripts/utils/helpers');
    var opluxModels = require('~/cartridge/models/opluxModels');
    var params = request.getHttpParameterMap();
    var orderNoArr = params.get('orderNo').getValue().split(',');
    var resData = {};
    var opluxResult; var
        handleOpluxResult;

    for (var i = 0; i < orderNoArr.length; i++) {
        var orderNo = orderNoArr[i];
        var order = opluxModels.getOrderById(orderNo);
        if (order) {
            request.setLocale(order.customerLocaleID);
            // デバイス情報
            var extraRaw = {
                telegram: {
                    event: {}
                }
            };
            var deviceInfo = order.custom.oplux_device_info || '';
            if (deviceInfo) {
                extraRaw.telegram.event.device_info = deviceInfo;
            }
            extraRaw.telegram.event.ip_address_only = order.getRemoteHost();
            opluxResult = helpers.eventRegistration(order, extraRaw);
            handleOpluxResult = helpers.eventRegistrationResultHandler(order, opluxResult, extraRaw);
            helpers.orderStatusHandler(order);
            handleOpluxResult.orderStatus = order.status.toString();
        }
        resData[orderNo] = handleOpluxResult;
    }

    OPLUX_LOGGER.info('=====OPLUX eventReRegistration() END=====');
    res.renderJSON(resData);
}

/**
 * Visually review and note
 */
function eventUpdate() {
    OPLUX_LOGGER.info('=====OPLUX eventUpdate() START=====');
    var res = require('~/cartridge/scripts/utils/response');
    var helpers = require('~/cartridge/scripts/utils/helpers');
    var opluxModels = require('~/cartridge/models/opluxModels');
    var constants = require('*/cartridge/scripts/utils/constants');
    var opluxResult;
    var handleOpluxResult = { success: false, errorMsg: '目視審査更新失敗しました。' };
    var params = request.getHttpParameterMap();
    var orderNo = params.get('orderNo').getValue();
    var updateSts = params.get('status').getValue();
    var updateMemo = params.get('maMemo').getValue();

    if (!orderNo) {
        handleOpluxResult.errorMsg = '目視審査更新失敗しました。orderNo不明';
    }

    var order = opluxModels.getOrderById(orderNo);
    var eventId = order.custom.oplux_event_id;
    if (order && eventId) {
        var extraRaw = {
            updateStatus: updateSts ? constants.EVENT_STATUS_CODE[updateSts] : '',
            memo: updateMemo
        };
        opluxResult = helpers.updateEventInfo(eventId, extraRaw);
        handleOpluxResult = helpers.eventUpdateResultHandler(order, opluxResult, params);
        helpers.orderStatusHandler(order);
        handleOpluxResult.orderStatus = order.status.toString();
    } else {
        handleOpluxResult.errorMsg = '目視審査更新失敗しました。order・eventId不明';
    }

    OPLUX_LOGGER.info('=====OPLUX eventUpdate() END=====');
    res.renderJSON(handleOpluxResult);
}

/**
 * BlackList registration and cancellation
 */
function eventUpdateBlacklist() {
    OPLUX_LOGGER.info('=====OPLUX eventUpdateBlacklist() START=====');
    var res = require('~/cartridge/scripts/utils/response');
    var helpers = require('~/cartridge/scripts/utils/helpers');
    var opluxModels = require('~/cartridge/models/opluxModels');
    var constants = require('*/cartridge/scripts/utils/constants');
    var opluxResult; var
        handleOpluxResult;
    var params = request.getHttpParameterMap();
    var orderNo = params.get('orderNo').getValue();

    if (!orderNo) {
        res.renderJSON({ success: false, errorMsg: 'orderNo is empty' });
    }

    var order = opluxModels.getOrderById(orderNo);
    if (order) {
        var eventId = order.custom.oplux_event_id;
        var customerType = params.get('customerType').getValue() || '';
        var settleCategory = params.get('settleCategory').getValue() || '';
        var otherCategory = params.get('otherCategory').getValue() || '';
        var blacked = params.get('blackStatus').getValue();
        var extraRaw;

        if (blacked === '0') {
            customerType = order.custom.oplux_black_customer_type.value.toString();
        }

        if (customerType === constants.BLACK_CUSTOMER_TYPE.BOTH_NG) {
            // update black_customer_type: 10
            extraRaw = {
                blacked: blacked,
                black_customer_type: constants.BLACK_CUSTOMER_TYPE.REGISTER_NG,
                black_settle_category: settleCategory,
                black_other_category: otherCategory
            };
            OPLUX_LOGGER.debug('=====OPLUX eventUpdateBlacklist() extraRaw: {0}', JSON.stringify(extraRaw));
            opluxResult = helpers.updateEventInfo(eventId, extraRaw);

            // update black_customer_type: 20
            extraRaw = {
                blacked: blacked,
                black_customer_type: constants.BLACK_CUSTOMER_TYPE.SHIPPING_ADDRESS_NG,
                black_settle_category: settleCategory,
                black_other_category: otherCategory
            };
            OPLUX_LOGGER.debug('=====OPLUX eventUpdateBlacklist() extraRaw: {0}', JSON.stringify(extraRaw));
            opluxResult = helpers.updateEventInfo(eventId, extraRaw);
            handleOpluxResult = helpers.eventUpdateResultHandler(order, opluxResult, params);
        } else {
            // update black_customer_type: 10 or 20
            extraRaw = {
                blacked: blacked,
                black_customer_type: customerType,
                black_settle_category: settleCategory,
                black_other_category: otherCategory
            };
            OPLUX_LOGGER.debug('=====OPLUX eventUpdateBlacklist() extraRaw: {0}', JSON.stringify(extraRaw));
            opluxResult = helpers.updateEventInfo(eventId, extraRaw);
            handleOpluxResult = helpers.eventUpdateResultHandler(order, opluxResult, params);
        }
    } else {
        res.renderJSON({ success: false, errorMsg: 'orderNo invalid' });
    }

    OPLUX_LOGGER.info('=====OPLUX eventUpdateBlacklist() END=====');
    res.renderJSON(handleOpluxResult);
}

exports.Show = show;
exports.Show.public = true;
exports.EventReRegistration = eventReRegistration;
exports.EventReRegistration.public = true;
exports.EventUpdate = eventUpdate;
exports.EventUpdate.public = true;
exports.EventUpdateBlacklist = eventUpdateBlacklist;
exports.EventUpdateBlacklist.public = true;
