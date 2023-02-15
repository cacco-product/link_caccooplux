'use strict';

/**
 * @module test/mock/dw/dw.order.Order.js
 */

module.exports = {
    getContent: function (contentName) {
        var resultObject = null;
        if (contentName === 'opluxCancelledEmail') {
            resultObject = {
                custom: {
                    body: {
                        markup: '<head></head><body><p>注文番号 : {$orderNumber}</p><p>名前 : {$customerName}</p><p>返金額 : {$amoutRefund}</p></body>'
                    }
                },
                name: contentName
            };
        }
        else if (contentName === 'empty') {
            resultObject = {
                custom: {},
                name: contentName
            };
        }
        return resultObject;
    }
};
