/* eslint-disable no-undef */

'use strict';

/**
* opluxModels.js unit tests
*/

var assert = require('chai').assert;
var opluxModelsModule = require('../../../../mock/bm_oplux/cartridge/models/opluxModels');
var opluxModels = opluxModelsModule.requireOpluxModels();

describe('opluxModels', function () {
    describe('getOrders', function () {
        it('should return true if .', function () {
            var obj = {
                SelectedMenuItem: {
                    value: 'TEST'
                },
                sz: {
                    intValue: 10
                },
                start: {
                    intValue: 0
                },
                createdDateFrom: {
                    stringValue: 'TEST'
                }
            };
            assert.isTrue(opluxModels.getOrders(obj).isOverSize);
        });
    });
    describe('getOrderById', function () {
        it('should return order information by order ID.', function () {
            assert.deepEqual(opluxModels.getOrderById('9999'), { orderId: '9999' });
        });
    });
});
