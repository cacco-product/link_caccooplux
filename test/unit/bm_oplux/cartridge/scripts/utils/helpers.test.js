/* eslint-disable no-undef */

'use strict';

/**
* helpers.js unit tests
*/

var assert = require('chai').assert;
var helpersModule = require('../../../../../mock/bm_oplux/cartridge/scripts/utils/helpers');
var helpers = helpersModule.requireHelpers();
var eventHelpersModule = require('../../../../../mock/int_oplux/cartridge/scripts/utils/eventHelpers');
var successResponseNameObject = {
    billingAddress: {
        firstName: '山田',
        lastName: '太郎'
    },
    defaultShipment: {
        shippingAddress: {
            firstName: '山田',
            lastName: '太郎'
        }
    },
    custom: {
        oplux_response_result: {
            value: '10'
        },
        oplux_error: {},
        oplux_event_aa_result: {
            value: 'OK'
        }
    }
};
var extraRaw = {
    telegram: {
        event: {
            device_info: 'device_info'
        }
    }
};

describe('helpers', function () {
    describe('eventRegistration', function () {
        it('should return result object if API call is successful.', function () {
            assert.deepEqual(helpers.eventRegistration(successResponseNameObject), {
                ok: true,
                status: 'OK',
                object: { checkoutSessionId: '12345-12345' },
                getErrorMessage: '',
                getObject: '',
                getStatus: '',
                isOk: true
            });
        });
    });
    describe('eventRegistrationResultHandler', function () {
        it('should return null if basket is null.', function () {
            assert.deepEqual(helpers.eventRegistrationResultHandler(null, eventHelpersModule.successfullyOpluxResult, extraRaw), null);
        });
        it('should return null if opluxResult is null.', function () {
            assert.deepEqual(helpers.eventRegistrationResultHandler(eventHelpersModule.eventRegistrationResultBasket, null, extraRaw), null);
        });
        it('should return API event registration success result object.', function () {
            var successResultObject = {
                aaResult: 'OK',
                eventId: '220331162427039FA75E2FA56A64EE8842F1DE7DCBBD19D',
                responseResult: '10',
                ruleCode: 'TEST_OKTEL',
                ruleDesc: 'テスト用の強制審査結果OK（TEL1末尾が0）',
                ruleGroup: '優先度3_OK_ルール単発',
                success: true
            };
            assert.deepEqual(helpers.eventRegistrationResultHandler(eventHelpersModule.eventRegistrationResultBasket, eventHelpersModule.successfullyOpluxResult, extraRaw), successResultObject);
        });
        it('should return API event registration failed result object.', function () {
            var failedResultObject = {
                success: false,
                responseResult: '20',
                errorMsg: '[yyyy/MM/dd HH:mm:ss] opluxResult.isOk is not a function'
            };
            assert.deepEqual(helpers.eventRegistrationResultHandler(eventHelpersModule.eventRegistrationResultBasket, eventHelpersModule.failOpluxResult, extraRaw), failedResultObject);
        });
    });
    describe('updateEventInfo', function () {
        it('should return encoded URL converted from Json.', function () {
            assert.deepEqual(helpers.updateEventInfo('12345', extraRaw), {
                ok: true,
                status: 'OK',
                object: { checkoutSessionId: '12345-12345' },
                getErrorMessage: '',
                getObject: '',
                getStatus: '',
                isOk: true
            });
        });
        it('should return null if eventID is empty.', function () {
            assert.deepEqual(helpers.updateEventInfo('', extraRaw), null);
        });
    });
    describe('eventUpdateResultHandler', function () {
        it('should return status object if update is successful.', function () {
            var order = {
                custom: {
                    oplux_event_ma_result: {},
                    oplux_event_ma_result_memo: {},
                    oplux_blacked_flag: {},
                    oplux_black_customer_type: {},
                    oplux_black_settle_category: {},
                    oplux_black_other_category: {},
                    oplux_error: {}
                },
                status: {
                    toString: function () {
                        return 'OPEN';
                    }
                }
            };
            var opluxResult = {
                isOk: function () {
                    return true;
                },
                getObject: function () {
                    return {
                        result: {
                            toString: function () {
                                return '10';
                            }
                        },
                        events: {
                            event: {
                                length: function () {
                                    return 1;
                                }
                            }
                        }
                    };
                },
                getErrorMessage: function () {},
                getError: function () {},
                getMsg: function () {}
            };
            var params = {
                get: function () {
                    return {
                        getValue: function () {
                            return '';
                        }
                    };
                }
            };
            assert.deepEqual(helpers.eventUpdateResultHandler(order, opluxResult, params), {
                success: true,
                responseResult: '10',
                orderStatus: 'OPEN'
            });
        });
        it('should return undefined if order or opluxResult is empty.', function () {
            var params = {
                get: function () {
                    return {
                        getValue: function () {
                            return '';
                        }
                    };
                }
            };
            assert.equal(helpers.eventUpdateResultHandler(null, null, params), undefined);
        });
    });
});
