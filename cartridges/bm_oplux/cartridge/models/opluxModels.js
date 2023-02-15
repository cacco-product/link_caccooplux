/* eslint-disable require-jsdoc */

'use strict';

var OPLUX_LOGGER = require('dw/system/Logger').getLogger('OPLUX', 'O-PLUX');

/**
 * Order validation
 * @param {Object} filterParams - all filter params
 * @param {Object} order - Order object
 * @returns {boolean} true or false
 */
function isOrderValid(filterParams, order) {
    var aaResult = filterParams.aaResult.stringValues;
    if (!empty(aaResult)) {
        if (!aaResult.contains(order.custom.oplux_event_aa_result.toString())) {
            return false;
        }
    }

    var maResult = filterParams.maResult.stringValues;
    if (!empty(maResult)) {
        if (!maResult.contains(order.custom.oplux_event_ma_result.toString())) {
            return false;
        }
    }

    var rulesCode = filterParams.rulesCode.stringValue;
    if (!empty(rulesCode)) {
        if (!order.custom.oplux_rule_code || order.custom.oplux_rule_code.toString().indexOf(rulesCode) === -1) {
            return false;
        }
    }

    var rulesGroup = filterParams.rulesGroup.stringValue;
    if (!empty(rulesGroup)) {
        if (!order.custom.oplux_rule_group || order.custom.oplux_rule_group.toString().indexOf(rulesGroup) === -1) {
            return false;
        }
    }

    var rulesDescription = filterParams.rulesDescription.stringValue;
    if (!empty(rulesDescription)) {
        if (!order.custom.oplux_rule_description || order.custom.oplux_rule_description.toString().indexOf(rulesDescription) === -1) {
            return false;
        }
    }

    var meResultMemo = filterParams.meResultMemo.stringValue;
    if (!empty(meResultMemo)) {
        if (!order.custom.oplux_event_ma_result_memo || order.custom.oplux_event_ma_result_memo.toString().indexOf(meResultMemo) === -1) {
            return false;
        }
    }

    var eventError = filterParams.eventError.stringValue;
    if (!empty(eventError)) {
        if (!order.custom.oplux_error || order.custom.oplux_error.toString().indexOf(eventError) === -1) {
            return false;
        }
    }

    return true;
}

/**
 * Order search query builder
 * @param {Object} filterParams - all filter params
 * @returns {string} query string
 */
function getQuery(filterParams) {
    var opluxConstants = require('*/cartridge/scripts/utils/constants');
    var Calendar = require('dw/util/Calendar');
    var StringUtils = require('dw/util/StringUtils');
    var Order = require('dw/order/Order');
    var calendar = new Calendar();
    var gmtCalendar = new Calendar();
    var Site = require('dw/system/Site');
    calendar.setTimeZone(Site.current.timezone);

    var query = '';
    if (!filterParams.SelectedMenuItem.value) {
        var createdDateFrom = filterParams.createdDateFrom.stringValue;
        if (createdDateFrom) {
            calendar.parseByFormat(createdDateFrom, "yyyy-MM-dd'T'HH:mm");
            gmtCalendar.setTime(calendar.getTime());
            query += 'creationDate>=' + StringUtils.formatCalendar(gmtCalendar, "yyyy-MM-dd'T'HH:mm:ss'+Z'");
        }

        var createdDateTo = filterParams.createdDateTo.stringValue;
        if (createdDateTo) {
            if (query) {
                query += ' AND ';
            }
            calendar.parseByFormat(createdDateTo, "yyyy-MM-dd'T'HH:mm");
            gmtCalendar.setTime(calendar.getTime());
            query += 'creationDate<=' + StringUtils.formatCalendar(gmtCalendar, "yyyy-MM-dd'T'HH:mm:ss'+Z'");
        }

        var responseResult = filterParams.responseResult.stringValue;
        if (responseResult) {
            if (query) {
                query += ' AND ';
            }
            query += "custom.oplux_response_result='" + responseResult + "'";
        }

        var blackStatus = filterParams.blackStatus.stringValue;
        if (blackStatus) {
            if (query) {
                query += ' AND ';
            }
            query += 'custom.oplux_blacked_flag=' + (blackStatus === '1');
        }

        var orderStatus = filterParams.orderStatus.stringValue;
        if (orderStatus) {
            if (query) {
                query += ' AND ';
            }
            switch (orderStatus.toString()) {
                case 'created':
                    query += 'status = ' + Order.ORDER_STATUS_CREATED;
                    break;
                case 'new':
                    query += 'status = ' + Order.ORDER_STATUS_NEW;
                    break;
                case 'open':
                    query += 'status = ' + Order.ORDER_STATUS_OPEN;
                    break;
                case 'completed':
                    query += 'status = ' + Order.ORDER_STATUS_COMPLETED;
                    break;
                case 'failed':
                    query += 'status = ' + Order.ORDER_STATUS_FAILED;
                    break;
                case 'cancelled':
                    query += 'status = ' + Order.ORDER_STATUS_CANCELLED;
                    break;
                case 'replaced':
                    query += 'status = ' + Order.ORDER_STATUS_REPLACED;
                    break;
                default:
                    break;
            }
        }
        var orderNo = filterParams.orderNo.stringValue;
        if (orderNo) {
            if (query) {
                query += ' AND ';
            }
            query += "orderNo='" + orderNo + "'";
        }
    } else {
        query = "custom.oplux_event_aa_result='" + opluxConstants.EVENT_STATUS.REVIEW + "' OR custom.oplux_event_aa_result='" + opluxConstants.EVENT_STATUS.HOLD + "'";
    }
    return query;
}

/**
 * Get order list
 * @param {Object} filterParams - all filter params
 * @returns {Object} list orders
 */
function getOrders(filterParams) {
    OPLUX_LOGGER.info('[opluxModels] getOrders() START');
    var OrderMgr = require('dw/order/OrderMgr');
    var opluxConstants = require('*/cartridge/scripts/utils/constants');
    var ordersIterator;
    var ArrayList = require('dw/util/ArrayList');
    var orders = new ArrayList();
    var isOverSize = false;

    var query = getQuery(filterParams);
    ordersIterator = OrderMgr.queryOrders(query, 'creationDate desc', null);

    while (ordersIterator.hasNext()) {
        var i = ordersIterator.next();
        OPLUX_LOGGER.debug('[opluxModels] getOrders(). orderNo: {0}', i.getOrderNo());

        if (filterParams.SelectedMenuItem.value || isOrderValid(filterParams, i)) {
            orders.push(i);
            if (orders.getLength() >= opluxConstants.LIMIT_SIZE) {
                isOverSize = true;
                break;
            }
        }
    }

    OPLUX_LOGGER.info('[opluxModels] getOrders() END');
    return { orders: orders, isOverSize: isOverSize };
}

/**
 * Get order detail
 * @param {string} orderId - ID of order
 * @returns {Object} order object
 */
function getOrderById(orderId) {
    OPLUX_LOGGER.debug('[opluxModels] getOrderById() START');
    var OrderMgr = require('dw/order/OrderMgr');
    var order = OrderMgr.getOrder(orderId);
    OPLUX_LOGGER.debug('[opluxModels] getOrderById() END');
    return order;
}

module.exports = {
    getOrders: getOrders,
    getOrderById: getOrderById
};
