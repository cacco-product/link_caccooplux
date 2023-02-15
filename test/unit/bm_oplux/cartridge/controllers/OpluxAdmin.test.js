/* eslint-disable no-undef */

'use strict';

/**
* OpluxAdmin.js unit tests
*/

var assert = require('chai').assert;
var opluxAdminModule = require('../../../../mock/bm_oplux/cartridge/controllers/OpluxAdmin');
var opluxAdmin = opluxAdminModule.requireOpluxAdmin();
var global = Function('return this')();
global.empty = function (value) {
    var result = true;
    if (value != null || value != undefined || value != '' || value.length() != 0) {
        result = false;
    }
    return result;
};
global.request = {
    httpParameterMap: {
        SelectedMenuItem: {
            value: 'TEST'
        },
        sz: {
            intValue: 10
        },
        start: {
            intValue: 0
        }
    },
    getHttpParameterMap: function () {
        return {
            get: function () {
                return {
                    getValue: function () {
                        return {
                            split: function () {
                                return ['1111'];
                            }
                        };
                    }
                };
            }
        };
    },
    setLocale: function () {}
};

describe('OpluxAdmin', function () {
    describe('show', function () {
        it('should return undefined if success ISML rendering.', function () {
            assert.equal(opluxAdmin.Show(), undefined);
        });
    });
    describe('eventReRegistration', function () {
        it('should return undefined if event registration is success.', function () {
            assert.equal(opluxAdmin.EventReRegistration(), undefined);
        });
    });
    describe('eventUpdate', function () {
        it('should return undefined if event update is success.', function () {
            assert.equal(opluxAdmin.EventUpdate(), undefined);
        });
    });
    describe('eventUpdateBlacklist', function () {
        it('should return undefined if update blacklist is success.', function () {
            assert.equal(opluxAdmin.EventUpdateBlacklist(), undefined);
        });
    });
});
