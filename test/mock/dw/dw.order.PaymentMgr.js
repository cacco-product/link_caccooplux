'use strict';

/**
 * @module test/mock/dw/dw.order.PaymentMgr.js
 */

module.exports = {
    getPaymentMethod: function (paymentMethodId) {
        var paymentMethod = {};
        if (paymentMethodId === 'CREDIT_CARD') {
            paymentMethod = {
                custom: {
                    oplux_model_id: 'CRD_01',
                    oplux_payment_method: {
                        value: '02'
                    }
                }
            };
        }
        return paymentMethod;
    }
};
