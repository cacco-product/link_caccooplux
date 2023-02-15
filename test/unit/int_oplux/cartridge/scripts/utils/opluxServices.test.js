/* eslint-disable no-undef */

'use strict';

/**
* opluxServices.js unit tests
*/

var assert = require('chai').assert;
var global = Function('return this')();
global.empty = function (value) {
    var result = true;
    if (value != null || value != undefined || value != '' || value.length() != 0) {
        result = false;
    }
    return result;
};
var eventHelpersModule = require('../../../../../mock/int_oplux/cartridge/scripts/utils/eventHelpers');
var opluxServicesModule = require('../../../../../mock/int_oplux/cartridge/scripts/utils/opluxServices');
var opluxServices = opluxServicesModule.requireOpluxServices();
var resultObject = {
    ok: true,
    status: 'OK',
    object: { checkoutSessionId: '12345-12345' }
};
describe('opluxServices', function () {
    describe('registerEvent', function () {
        it('should return API execution result object.', function () {
            var result = opluxServices.registerEvent(eventHelpersModule.basket, eventHelpersModule.normalizedNames, eventHelpersModule.extraRaw);
            assert.deepEqual(result.ok, resultObject.ok);
            assert.deepEqual(result.status, resultObject.status);
            assert.deepEqual(result.object, resultObject.object);
        });
        it('should return null if basket is empty.', function () {
            assert.deepEqual(opluxServices.registerEvent(), null);
        });
    });
    describe('getEventInfo', function () {
        it('should return encoded URL converted from Json.', function () {
            var result = opluxServices.getEventInfo('12345');
            assert.deepEqual(result.ok, resultObject.ok);
            assert.deepEqual(result.status, resultObject.status);
            assert.deepEqual(result.object, resultObject.object);
        });
        it('should return null if eventID is empty.', function () {
            assert.deepEqual(opluxServices.getEventInfo(''), null);
        });
    });
    describe('updateEventInfo', function () {
        it('should return encoded URL converted from Json.', function () {
            var result = opluxServices.updateEventInfo('12345', eventHelpersModule.extraRaw);
            assert.deepEqual(result.ok, resultObject.ok);
            assert.deepEqual(result.status, resultObject.status);
            assert.deepEqual(result.object, resultObject.object);
        });
        it('should return null if eventID is empty.', function () {
            assert.deepEqual(opluxServices.updateEventInfo('', eventHelpersModule.extraRaw), null);
        });
    });
    describe('getNormalizedName', function () {
        it('should return normalized name object.', function () {
            var normalizedNameObject = {
                firstName: {
                    alphabet: null,
                    reading: null,
                    writing: '太郎'
                },
                lastName: {
                    alphabet: null,
                    existed: true,
                    reading: null,
                    writing: '山田'
                },
                letterCount: {
                    alphabetCountInName: 0,
                    hiraganaCountInName: 0,
                    kanjiCountInName: 4,
                    katakanaCountInName: 0,
                    nameLength: 4,
                    otherCountInName: 0
                },
                result: 'success',
                time: 1
            };
            var result = opluxServices.getNormalizedName('太郎', '山田');
            assert.deepEqual(result.firstName, normalizedNameObject.firstName);
            assert.deepEqual(result.lastName, normalizedNameObject.lastName);
            assert.deepEqual(result.letterCount, normalizedNameObject.letterCount);
            assert.deepEqual(result.result, normalizedNameObject.result);
            assert.deepEqual(result.time, normalizedNameObject.time);
        });
        it('should return null if firstName or lastName is empty.', function () {
            assert.deepEqual(opluxServices.getNormalizedName('', ''), null);
        });
    });
});
