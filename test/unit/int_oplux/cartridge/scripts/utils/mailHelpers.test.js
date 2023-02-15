/* eslint-disable no-undef */

'use strict';

/**
* mailHelpers.js unit tests
*/

var assert = require('chai').assert;
var mailHelpersModule = require('../../../../../mock/int_oplux/cartridge/scripts/utils/mailHelpers');
var mailHelpers = mailHelpersModule.requireMailHelpers();

describe('eventHelpers', function () {
    describe('sendCancelEmail', function () {
        it('should return undefined if success.', function () {
            assert.equal(mailHelpers.sendCancelEmail(mailHelpersModule.order, 'subject'), undefined);
        });
    });
});
