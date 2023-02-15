/* eslint-disable no-undef */

'use strict';

/**
* opluxGetEventInfo.js unit tests
*/

var assert = require('chai').assert;
var opluxGetEventInfoModule = require('../../../../../mock/bm_oplux/cartridge/scripts/jobs/opluxGetEventInfo');
var opluxGetEventInfo = opluxGetEventInfoModule.requireOpluxGetEventInfo();

describe('opluxGetEventInfo', function () {
    describe('execute', function () {
        it('should return undefined if opluxGetEventInfo succeeds.', function () {
            assert.equal(opluxGetEventInfo.execute(), undefined);
        });
    });
});
