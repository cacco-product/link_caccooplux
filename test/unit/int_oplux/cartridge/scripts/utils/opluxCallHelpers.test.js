/* eslint-disable no-undef */

'use strict';

/**
* opluxCallHelper.js unit tests
*/

var assert = require('chai').assert;
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
var failResponseNameObject = {
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
            value: '20'
        },
        oplux_error: {},
        oplux_event_aa_result: {
            value: 'NG'
        }
    }
};
var opluxSuccessResultObject = {
    custom: {
        oplux_event_aa_result: {
            value: 'OK'
        },
        oplux_response_result: {
            value: '10'
        }
    }
};

var opluxErrorResultObject = {
    custom: {
        oplux_event_aa_result: {
            value: 'NG'
        },
        oplux_response_result: {
            value: '20'
        }
    }
};

var opluxCallHelpersModule = require('../../../../../mock/int_oplux/cartridge/scripts/utils/opluxCallHelpers');

describe('opluxCallHelpers', function () {
    describe('getNormalizedNames', function () {
        it('should return normalized name.', function () {
            var opluxCallHelpers = opluxCallHelpersModule.proxyQuireOpluxCallHelpers();
            assert.deepEqual(opluxCallHelpers.getNormalizedNames(successResponseNameObject), {
                buyer: {
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
                    result: 'success',
                    letterCount: {
                        alphabetCountInName: 0,
                        hiraganaCountInName: 0,
                        kanjiCountInName: 4,
                        katakanaCountInName: 0,
                        nameLength: 4,
                        otherCountInName: 0
                    },
                    time: 1
                },
                delivery: {
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
                    result: 'success',
                    letterCount: {
                        alphabetCountInName: 0,
                        hiraganaCountInName: 0,
                        kanjiCountInName: 4,
                        katakanaCountInName: 0,
                        nameLength: 4,
                        otherCountInName: 0
                    },
                    time: 1
                }
            });
        });
    });
    describe('opluxResultValidation', function () {
        it('should return validated result true.', function () {
            var opluxCallHelpers = opluxCallHelpersModule.proxyQuireOpluxCallHelpers();
            assert.isTrue(opluxCallHelpers.opluxResultValidation(opluxSuccessResultObject));
        });
        it('should return validated result false.', function () {
            var opluxCallHelpers = opluxCallHelpersModule.proxyQuireOpluxCallHelpers();
            assert.isFalse(opluxCallHelpers.opluxResultValidation(opluxErrorResultObject));
        });
    });
    describe('checkOplux', function () {
        it('should return successfully response object if the API call is successful.', function () {
            var opluxCallHelpers = opluxCallHelpersModule.proxyQuireOpluxCallHelpers();
            assert.isTrue(opluxCallHelpers.checkOplux(successResponseNameObject).pass);
        });
        it('should return unsuccessfully response object and error message if the API call is failed.', function () {
            var opluxCallHelpers = opluxCallHelpersModule.proxyQuireOpluxCallHelpers();
            assert.isFalse(opluxCallHelpers.checkOplux(failResponseNameObject).pass);
        });
    });
});
