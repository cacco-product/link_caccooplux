/* eslint-disable no-undef */

'use strict';

/**
* opluxSettleStatusFinder.js unit tests
*/

var assert = require('chai').assert;
var opluxSettleStatusFinderModule = require('../../../../../mock/bm_oplux/cartridge/scripts/jobs/opluxSettleStatusFinder');
var opluxSettleStatusFinder = opluxSettleStatusFinderModule.requireOpluxSettleStatusFinder();
var order = {
    paymentInstruments: [{
        empty: false,
        paymentMethod: 'CREDIT_CARD'
    }],
    getStatus: function () {
        return { value: 0 };
    },
    getExportStatus: function () {
        return { value: 0 };
    },
    getPaymentStatus: function () {
        return { value: 0 };
    },
    getShippingStatus: function () {
        return { value: 0 };
    }
};

describe('opluxSettleStatusFinder', function () {
    describe('getSettleStatus', function () {
        it('should return 00 if order status is created.', function () {
            assert.equal(opluxSettleStatusFinder.getSettleStatus(order), '00');
        });
    });
});
