/* eslint-disable no-undef */

'use strict';

/**
* contentHelpers.js unit tests
*/

var assert = require('chai').assert;
var contentHelpersModule = require('../../../../../mock/int_oplux/cartridge/scripts/utils/contentHelpers');
var contentHelpers = contentHelpersModule.requireContentMgr();
var contentName = 'opluxCancelledEmail';
var successparams = {
    customerName: '太郎 山田',
    orderNumber: '00003701',
    amountRefund: '3,814'
};
var resultString = '<head></head><body><p>注文番号 : {$orderNumber}</p><p>名前 : {$customerName}</p><p>返金額 : {$amoutRefund}</p></body>';

describe('contentHelper', function () {
    describe('getReplaceContent', function () {
        it('should return warning message when does not exist contentName.', function () {
            assert.equal(contentHelpers.getReplaceContent('test', successparams), 'Does not exist content test');
        });
        it('should return content body from content asset.', function () {
            assert.equal(contentHelpers.getReplaceContent(contentName, successparams), resultString);
        });
        it('should return empty string.', function () {
            assert.equal(contentHelpers.getReplaceContent('empty', successparams), '');
        });
    });
    describe('getEmailTitle', function () {
        it('should return opluxCancelledEmail.', function () {
            assert.equal(contentHelpers.getEmailTitle(contentName), 'opluxCancelledEmail');
        });
    });
});
