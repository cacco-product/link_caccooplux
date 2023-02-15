'use strict';

/**
 * @module test\mock\bm_oplux\cartridge\scripts\utils\response.js
 */

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

module.exports = {
    requireResponse: function () {
        return proxyquire(
            '../../../../../../cartridges/bm_oplux/cartridge/models/response.js',
            {}
        );
    },
    renderJSON: function () {
        return {};
    }
};
