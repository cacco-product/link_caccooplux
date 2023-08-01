'use strict';

/**
 * @module test\mock\int_oplux\cartridge\scripts\utils\eventHelpers.js
 */

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

module.exports = {
    requireEventHelpers: function () {
        return proxyquire(
            '../../../../../../cartridges/int_oplux/cartridge/scripts/utils/eventHelpers.js',
            {
                server: {
                    forms: {
                        getForm: function () {
                            return {
                                paymentMethod: {
                                    htmlValue: 'CREDIT_CARD'
                                }
                            };
                        }
                    }
                },
                'dw/system/Logger': require('../../../../../../test/mock/dw/dw.system.Logger'),
                'dw/util/Bytes': require('../../../../../../test/mock/dw/dw.util.Bytes'),
                'dw/crypto/Encoding': require('../../../../../../test/mock/dw/dw.crypto.Encoding'),
                'dw/crypto/MessageDigest': require('../../../../../../test/mock/dw/dw.crypto.MessageDigest'),
                'dw/util/StringUtils': require('../../../../../../test/mock/dw/dw.util.StringUtils'),
                'dw/util/Calendar': require('../../../../../../test/mock/dw/dw.util.Calendar'),
                '~/cartridge/scripts/utils/constants': require('../../../../../../test/mock/int_oplux/cartridge/scripts/utils/constants'),
                '*/cartridge/scripts/utils/constants': require('../../../../../../test/mock/int_oplux/cartridge/scripts/utils/constants'),
                'dw/order/PaymentMgr': require('../../../../../../test/mock/dw/dw.order.PaymentMgr'),
                'dw/system/Transaction': require('../../../../../../test/mock/dw/dw.system.Transaction'),
                'dw/io/Reader': require('../../../../../../test/mock/dw/dw.io.Reader'),
                'dw/io/XMLStreamReader': require('../../../../../../test/mock/dw/dw.io.XMLStreamReader'),
                'dw/io/XMLStreamConstants': require('../../../../../../test/mock/dw/dw.io.XMLStreamConstants')
            }
        );
    },
    buildSignature: function () {
        return {
            stringEncoding: function () {
                return 'HASH_TEST';
            }
        };
    },
    basket: {
        billingAddress: {
            city: 'テスト市',
            address1: 'テスト区',
            address2: null,
            companyName: null,
            jobTitle: null,
            firstName: '太郎',
            lastName: '山田',
            countryCode: {
                value: 'JP',
                displayValue: 'Japan'
            },
            custom: {
                oplux_last_name_kana: 'ヤマダ'
            },
            postalCode: '980-0022',
            stateCode: 'テスト県',
            phone: 'o12-3456-789'
        },
        customerEmail: 'test.co.jp',
        defaultShipment: {
            shippingAddress: {
                city: 'テスト市',
                address1: 'テスト区',
                address2: null,
                companyName: null,
                jobTitle: null,
                firstName: '太郎',
                lastName: '山田',
                countryCode: {
                    value: 'JP',
                    displayValue: 'Japan'
                },
                custom: {
                    oplux_last_name_kana: 'ヤマダ'
                },
                postalCode: '980-0022',
                stateCode: 'テスト県',
                phone: 'o12-3456-789'
            }
        },
        creationDate: 'Thu Mar 31 2022 05:44:03 GMT-0000 (GMT)',
        totalGrossPrice: {
            value: '3814'
        },
        paymentInstruments: {
            empty: true
        },
        getCustomer: function () {
            return {
                isRegistered: function () {
                    return true;
                },
                getProfile: function () {
                    return {
                        phoneMobile: '123',
                        birthday: '2000/12/31',
                        gender: {
                            value: 1
                        }
                    };
                }
            };
        },
        getCustomerNo: function () {
            return '987';
        },
        getUUID: function () {
            return '987';
        }
    },
    normalizedNames: function () {
        return {
            buyer: {
                firstName: {
                    alphabet: null,
                    reading: null,
                    writing: '太郎'
                },
                lastName: {
                    alphabet: null,
                    correctReading: true,
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
            },
            delivery: {
                firstName: {
                    alphabet: null,
                    reading: null,
                    writing: '太郎'
                },
                lastName: {
                    alphabet: null,
                    correctReading: true,
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
            }
        };
    },
    eventRegistrationResultBasket: {
        billingAddress: {
            city: 'テスト市',
            address1: 'テスト区',
            address2: null,
            companyName: null,
            jobTitle: null,
            firstName: '太郎',
            lastName: '山田',
            countryCode: {
                value: 'JP',
                displayValue: 'Japan'
            },
            postalCode: '980-0022',
            stateCode: 'テスト県',
            phone: 'o12-3456-789'
        },
        customerEmail: 'test.co.jp',
        defaultShipment: {
            shippingAddress: {
                city: 'テスト市',
                address1: 'テスト区',
                address2: null,
                companyName: null,
                jobTitle: null
            }
        },
        creationDate: 'Thu Mar 31 2022 05:44:03 GMT-0000 (GMT)',
        totalGrossPrice: {
            value: '3814'
        },
        custom: {
            oplux_response_result: '',
            oplux_error: '',
            oplux_device_info: '',
            oplux_event_api_response_json: '{"CRD_01":{"aaResult":"OK","blackedFlag":false,"deviceInfo":"deviceInfo","errorMsg":"","eventId":"220401154716238F1A63778FE5942D3B318C5581AFD1DCA","responseResult":"10","ruleCode":"TEST_OKTEL","ruleDesc":"テスト用の強制審査結果OK（TEL1末尾が0）","ruleGroup":"優先度3_OK_ルール単発","settleStatus":"00"}}'
        },
        paymentInstruments: {
            empty: true
        }
    },
    successfullyOpluxResult: {
        error: 0,
        errorMessage: null,
        mockResult: false,
        msg: 'OK',
        ok: true,
        status: 'OK',
        unavailableReason: null,
        object: {
            time: 57,
            result: {
                toString: function () {
                    return 10;
                }
            },
            telegram: {
                event: {
                    id: {
                        toString: function () {
                            return '220331162427039FA75E2FA56A64EE8842F1DE7DCBBD19D';
                        }
                    },
                    aaresult: {
                        toString: function () {
                            return 'OK';
                        }
                    },
                    rule_group: {
                        toString: function () {
                            return '優先度3_OK_ルール単発';
                        }
                    },
                    rules: [{
                        code: 'TEST_OKTEL',
                        description: 'テスト用の強制審査結果OK（TEL1末尾が0）'
                    }]
                }
            }
        },
        isOk: function () {
            return true;
        },
        getObject: function () {
            return { "time": "57", "result": "10", "telegram": { "event": { "id": "220331162427039FA75E2FA56A64EE8842F1DE7DCBBD19D", "aaresult": { "result": "OK" }, "rule_group": "優先度3_OK_ルール単発", "rules": [{ "code": "TEST_OKTEL", "description": "テスト用の強制審査結果OK（TEL1末尾が0）" }] } } };
        }
    },
    failOpluxResult: {
        error: 400,
        errorMessage: {
            time: 15,
            result: 20,
            errors: [{
                code: 'InvalidData.AuthoriModelNone',
                message: '審査モデルのデータが不正です。審査モデルの登録が無いか、もしくは無効になっています。'
            }]
        },
        mockResult: false,
        msg: 'Bad Request',
        ok: false,
        status: 'ERROR',
        unavailableReason: null
    },
    getObjectForApiRegisterEvent: function () {
        return { TEST: 999 };
    },
    convertJsonToUrlEncode: function () {
        return 'name=%E5%B1%B1%E7%94%B0%20%E5%A4%AA%E9%83%8E&fields=firstName%2ClastName';
    },
    getObjectForApiGetEvent: function (eventId) {
        var result = null;
        if (eventId === '12345') {
            return {
                'request.version': '1.0',
                'request.shop_id': 'SP00WIREDBEANS',
                'request.signiture': 'aaa',
                'request.hash_method': 'SHA256',
                'request.request_datetime': '2022/03/18 16:35:33',
                'request.fields': 'rules,score,similars,aaresult,maresult',
                'request.condition.event_id': eventId
            };
        }
        return result;
    },
    getObjectForApiUpdateEvent: function (eventId) {
        var result = null;
        if (eventId === '12345') {
            return {
                'request.version': '1.0',
                'request.shop_id': 'SP00WIREDBEANS',
                'request.signiture': 'TEST',
                'request.hash_method': 'DIGEST_SHA_256',
                'request.request_datetime': 'YYYY/MM/dd HH:mm:ss',
                request: {
                    condition: {
                        event_id: eventId
                    },
                    update: {
                        black_customer_type: {},
                        black_other_category: {},
                        black_settle_category: {},
                        blacked: {},
                        deleted: '1',
                        maResult: '10',
                        memo: {},
                        settle_status: '00'
                    }
                }
            };
        }
        return result;
    },
    getObjectForApiGetNormalizedName: function (firstName, lastName, lastNameKana) {
        if (!firstName || !lastName) {
            return null;
        }
        return {
            name: lastName + ' ' + firstName,
            fields: 'firstName,lastName',
            lastFurigana: lastNameKana
        };
    },
    eventRegistrationResultHandler: function (basketOrOrder, opluxResult, extraRaw) {
        if (basketOrOrder === null || opluxResult === null) {
            return null;
        }
        if (opluxResult.ok) {
            return {
                aaResult: 'OK',
                eventId: '220331162427039FA75E2FA56A64EE8842F1DE7DCBBD19D',
                responseResult: '10',
                ruleCode: 'TEST_OKTEL',
                ruleDesc: 'テスト用の強制審査結果OK（TEL1末尾が0）',
                ruleGroup: '優先度3_OK_ルール単発',
                success: true
            };
        }
        return {
            success: false,
            responseResult: '20',
            errorMsg: '[YYYY/MM/dd HH:mm:ss] opluxResult.isOk is not a function'
        };
    },
    parseToXML: function () {
        return {
            result: {
                toString: function () {
                    return '10';
                }
            },
            errors: [{
                error: [{
                    code: 'InvalidData.AuthoriModelNone',
                    message: '審査モデルのデータが不正です。審査モデルの登録が無いか、もしくは無効になっています。'
                }]
            }]
        };
    }
};
