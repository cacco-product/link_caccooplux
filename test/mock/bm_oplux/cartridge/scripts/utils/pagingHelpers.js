'use strict';

/**
 * @module test\mock\bm_oplux\cartridge\scripts\utils\pagingHelpers.js
 */

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

module.exports = {
    requirePagingHelpers: function () {
        return proxyquire(
            '../../../../../../cartridges/bm_oplux/cartridge/scripts/utils/pagingHelpers.js',
            {}
        );
    }
};
