/* eslint-disable no-undef */

'use strict';

/**
* pagingHelpers.js unit tests
*/

var assert = require('chai').assert;
var pagingHelpersModule = require('../../../../../mock/bm_oplux/cartridge/scripts/utils/pagingHelpers');
var pagingHelpers = pagingHelpersModule.requirePagingHelpers();
var pagingmodel = {
    start: 0,
    count: 1,
    pageSize: 2,
    currentPage: 3,
    maxPage: 4
};
var pageURL = {
    indexOf: function () {
        return 5;
    },
    substring: function () {
        return 'TEST';
    }
};

describe('pagingHelpers', function () {
    describe('getPagingInfo', function () {
        it('should return result page information object.', function () {
            assert.deepEqual(pagingHelpers.getPagingInfo(pagingmodel, pageURL), {
                totalCount: 1,
                pageSize: 2,
                showingStart: 1,
                showingEnd: 1,
                pageURL: 'TEST',
                maxPage: 4,
                pagingUrl: 'TEST',
                current: 0,
                currentPage: 3,
                rangeBegin: 0,
                rangeEnd: 4
            });
        });
    });
});
