/* eslint-disable no-plusplus */
/* eslint-disable require-jsdoc */
'use strict';

var Logger = require('dw/system/Logger').getLogger('OpluxJobLog', 'O-PLUX');
var PaymentMgr = require('dw/order/PaymentMgr');

/**
 * @param {Object} order
 * @returns {Object} statusKey
 */
function getStatusArray(order) {
    var statusKey = [
        order.getStatus().value,
        order.getExportStatus().value,
        order.getPaymentStatus().value,
        order.getShippingStatus().value
    ];
    return statusKey;
}
/**
 * @param {Object} statusKey
 * @param {Object} table
 * @returns {string} opluxSettleStatus
 */
function getSettleStatusFromTable(statusKey, table) {
    var opluxSettleStatus = null;
    for (var idx = 0; idx < statusKey.length; idx++) {
        var key = statusKey[idx];
        if (typeof (table[key]) === 'object') {
            table = table[key];
        } else if (typeof (table[key]) === 'string') {
            opluxSettleStatus = table[key];
            break;
        } else if (table.default) {
            table = table.default;
        } else {
            opluxSettleStatus = null;
            break;
        }
    }
    return opluxSettleStatus;
}

var settleStatusFinder = {
    getSettleStatus: function (order) {
        Logger.info('=======settleStatusFinder=============');
        var paymentMethodID = order.paymentInstruments.empty ? 'NO_PAYMENT' : order.paymentInstruments[0].paymentMethod;
        var paymentMethod = PaymentMgr.getPaymentMethod(paymentMethodID);
        var opluxPaymentID = paymentMethod.custom.oplux_payment_method.value;
        if (!paymentMethod) {
            throw '[OPLUX] updateSettleStatus. This payment method is not exist.';
        }
        if (!opluxPaymentID) {
            throw '[OPLUX] updateSettleStatus. This payment method is not assigned with oplux_payment_method.';
        }

        var opluxSettleStatus = null;
        // check customStatusMap
        if (this.customStatusMap[paymentMethodID]) {
            opluxSettleStatus = statusMap[paymentMethodID](order);
        } else if (this.customStatusMap[opluxPaymentID]) {
            opluxSettleStatus = this.customStatusMap[opluxPaymentID](order);
        }

        if (opluxSettleStatus == null && this.statusTable[opluxPaymentID]) {
            opluxSettleStatus = getSettleStatusFromTable(
                getStatusArray(order),
                this.statusTable[opluxPaymentID]
            );
        }
        if (opluxSettleStatus == null) {
            opluxSettleStatus = getSettleStatusFromTable(
                getStatusArray(order),
                this.statusTable.default
            );
        }

        return opluxSettleStatus;
    },
    customStatusMap: {
        //            *** Example ***
        //            'SOME_PAYMENT_ID': function(order){
        //                if(order.getStatus()==Order.ORDER_STATUS_REPLACED){
        //                    return '99';
        //                }
        //                else{
        //                    return null;
        //                }
        //            },
        //            '99': function(order){
        //                if(order.custom.somtingAttribute == true){
        //                    return '20';
        //                }
        //                else{
        //                    return '00';
        //                }
        //            },
        '01': function (order) {
            var Order = require('dw/order/Order');
            Logger.debug('=====Custom SettleStatusFinder Started.=====');
            var now = new Date();
            if (order.custom.payLimitDate < now
                && order.paymentStatus == Order.PAYMENT_STATUS_NOTPAID
                && (order.status == Order.ORDER_STATUS_NEW
                    || order.status == Order.ORDER_STATUS_OPEN)
            ) {
                return '30';
            }
            return null;
        }
    },
    statusTable: {
        // table[orderStatus][exportStatus][paymentStatus][shippingStatus]
        default: {
            0: '00', // ORDER_STATUS_CREATED
            3: { // ORDER_STATUS_NEW
                default: { // Any Export Status
                    2: '20' // PAYMENT_STATUS_PAID
                }
            },
            4: { // ORDER_STATUS_OPEN
                default: { // Any Export Status
                    2: '20' // PAYMENT_STATUS_PAID
                }
            },
            5: { // ORDER_STATUS_COMPLETED
                default: { // Any Export Status
                    2: { // SHIPPING_STATUS_SHIPPED
                        2: '20' // PAYMENT_STATUS_PAID
                    }
                }
            },
            6: { // ORDER_STATUS_CANCELLED
                default: { // Any Export Status
                    default: { // Any Payment Status
                        0: '99', // SHIPPING_STATUS_NOT_SHIPPED
                        2: '100' // SHIPPING_STATUS_SHIPPED
                    }
                }
            },
            7: null, // ORDER_STATUS_REPLACED
            8: '99' // ORDER_STATUS_FAILED
        }
        //            *** example ***
        //            '02': {
        //                3: {
        //                    default: {
        //                        2: '20',
        //                    },
        //                },
        //            },
    }
};

module.exports = settleStatusFinder;

/* <Oplux Payment Method>
 * 01 : 後払い
 * 02 : クレジットカード決済
 * 03 : 代金引換
 * 04 : 前払い
 * 05 : 電子マネー
 * 06 : ポイント支払い
 * 07 : 口座振替
 * 08 : 分割払い
 * 09 : Payeasy
 * 10 : PayPal
 * 99 : その他
 */

/* <Oplux Settle Status>
 *  00 : 請求前
 *  10 : 請求中
 *  20 : 請求済み
 *  30 : 期限超過
 *  40 : 委託済
 *  50 : 貸倒
 *  60 : チャージバック
 *  99 : キャンセル
 * 100 : 送付後キャンセル
 */

/* <Order Status>
 * ORDER_STATUS_CREATED:    0
 * ORDER_STATUS_NEW:        3
 * ORDER_STATUS_OPEN:       4
 * ORDER_STATUS_COMPLETED:  5
 * ORDER_STATUS_CANCELLED:  6
 * ORDER_STATUS_REPLACED:   7
 * ORDER_STATUS_FAILED:     8
 *
 * <Export Status>
 * EXPORT_STATUS_NOTEXPORTED:   0
 * EXPORT_STATUS_EXPORTED:      1
 * EXPORT_STATUS_READY:         2
 * EXPORT_STATUS_FAILED:        3
 *
 * <Payment Status>
 * PAYMENT_STATUS_NOTPAID:  0
 * PAYMENT_STATUS_PARTPAID: 1
 * PAYMENT_STATUS_PAID:     2
 *
 * <Shipping Status>
 * SHIPPING_STATUS_NOTSHIPPED:  0
 * SHIPPING_STATUS_PARTSHIPPED: 1
 * SHIPPING_STATUS_SHIPPED:     2
 */
