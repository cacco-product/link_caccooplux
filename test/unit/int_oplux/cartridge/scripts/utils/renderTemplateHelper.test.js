/* eslint-disable no-undef */

'use strict';

/**
* renderTemplateHelper.js unit tests
*/
var assert = require('chai').assert;
var renderTemplateHelperModule = require('../../../../../mock/int_oplux/cartridge/scripts/utils/renderTemplateHelper');
var renderTemplateHelper = renderTemplateHelperModule.requireRenderTemplateHelper();

describe('renderTemplateHelper', function () {
    describe('getRenderedHtml', function () {
        it('should return API execution result object.', function () {
            var context = { test: 'test' };
            assert.equal(renderTemplateHelper.getRenderedHtml(context, 'email/orderCancelledEmail'), 'rendered html');
        });
    });
});
