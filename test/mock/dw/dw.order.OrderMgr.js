'use strict';

/**
 * @module test/mock/dw/dw.order.OrderMgr.js
 */

module.exports = {
    queryOrders: function () {
        return {
            hasNext: function () {
                return true;
            },
            next: function () {
                return {
                    getOrderNo: function () {
                        return '1111';
                    },
                    order: {
                        custom: {
                            oplux_event_aa_result: {
                                toString: function () { return ''; }
                            }
                        }
                    }
                };
            }
        };
    },
    getOrder: function (orderId) {
        return {
            orderId: orderId
        };
    },
    searchOrders: function () {
        return {
            hasNext: function () {
                return true;
            },
            next: function () {
                return {
                    getOrderNo: function () {},
                    getStatus: function () {},
                    custom: {
                        oplux_event_id: '1234'
                    }
                };
            }
        };
    }
};
