'use strict';

/**
 * @module test\mock\bm_oplux\cartridge\scripts\jobs\opluxSettleStatusFinder.js
 */

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

module.exports = {
    requireOpluxSettleStatusFinder: function () {
        return proxyquire(
            '../../../../../../cartridges/bm_oplux/cartridge/scripts/jobs/opluxSettleStatusFinder.js',
            {
                'dw/order/Order': require('../../../../../../test/mock/dw/dw.order.Order'),
                'dw/system/Logger': require('../../../../../../test/mock/dw/dw.system.Logger'),
                'dw/order/PaymentMgr': require('../../../../../../test/mock/dw/dw.order.PaymentMgr')
            }
        );
    }
};
