'use strict';

/**
 * @module test\mock\int_oplux\cartridge\scripts\utils\renderTemplateHelper.js
 */

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

module.exports = {
    requireRenderTemplateHelper: function () {
        return proxyquire(
            '../../../../../../cartridges/int_oplux/cartridge/scripts/utils/renderTemplateHelper',
            {
                'dw/util/HashMap': require('../../../../../../test/mock/dw/dw.util.HashMap'),
                'dw/util/Template': require('../../../../../../test/mock/dw/dw.util.Template')
            }
        );
    },
    getRenderedHtml: function () {
        return {};
    }
};
