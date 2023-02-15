'use strict';

/**
 * @module test\mock\int_oplux\cartridge\scripts\utils\contentHelpers.js
 */

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

module.exports = {
    requireContentMgr: function () {
        return proxyquire(
            '../../../../../../cartridges/int_oplux/cartridge/scripts/utils/contentHelpers',
            {
                'dw/content/ContentMgr': require('../../../../../../test/mock/dw/dw.content.ContentMgr')
            }
        );
    },
    getReplaceContent: function () {
        return {};
    },
    getEmailTitle: function () {
        return {};
    }
};
