/* eslint-disable no-undef */

'use strict';

/**
* eventHelpers.js unit tests
*/

// sleep is a function that executes an infinite loop until a specified time,
// the performance at the time of test code execution deteriorates,
// and UnitTest does not guarantee the operation of being waited on the server side of SFCC,
// so it is excluded from the test.

var assert = require('chai').assert;
var global = Function('return this')();
global.empty = function (value) {
    var result = true;
    if (value != null || value != undefined || value != '') {
        result = false;
    }
    return result;
};
global.session = {
    getPrivacy: function () {
        return {
            cardNumber: '4111111111111111'
        };
    }
};
var eventHelpersModule = require('../../../../../mock/int_oplux/cartridge/scripts/utils/eventHelpers');
var eventHelpers = eventHelpersModule.requireEventHelpers();

describe('eventHelpers', function () {
    describe('convertJsonToUrlEncode', function () {
        it('should return encoded URL converted from Json.', function () {
            var requestObject = {
                name: '山田 太郎',
                fields: 'firstName,lastName'
            };
            assert.equal(eventHelpers.convertJsonToUrlEncode(requestObject), 'name=%E5%B1%B1%E7%94%B0%20%E5%A4%AA%E9%83%8E&fields=firstName%2ClastName');
        });
    });
    describe('merge', function () {
        it('should return argument object if there is no second argument.', function () {
            var dst = {
                info: {
                    hash_method: 'SHA256',
                    request_datetime: '2022/03/31 13:19:58',
                    shop_id: 'SP00WIREDBEANS',
                    signature: '7E4C68E968BB76E024B900FB2B220D0B41B4B7A2280C767452812214DF2B809D',
                    version: '3.0'
                }
            };
            assert.deepEqual(eventHelpers.merge(dst), dst);
        });
        it('should return merged object', function () {
            var dst = {
                info: {
                    hash_method: 'SHA256',
                    request_datetime: '2022/03/31 13:19:58',
                    shop_id: 'SP00WIREDBEANS',
                    signature: '7E4C68E968BB76E024B900FB2B220D0B41B4B7A2280C767452812214DF2B809D',
                    version: '3.0'
                }
            };
            var src = {
                settle: {
                    amount: '3814',
                    credit_card: {
                        bincode: '411111'
                    }
                }
            };
            var result = {
                info: {
                    hash_method: 'SHA256',
                    request_datetime: '2022/03/31 13:19:58',
                    shop_id: 'SP00WIREDBEANS',
                    signature: '7E4C68E968BB76E024B900FB2B220D0B41B4B7A2280C767452812214DF2B809D',
                    version: '3.0'
                },
                settle: {
                    amount: '3814',
                    credit_card: {
                        bincode: '411111'
                    }
                }
            };
            assert.deepEqual(eventHelpers.merge(dst, src), result);
        });
    });
    describe('getObjectForApiGetNormalizedName', function () {
        it('should return hashed name and field name to get normalized name from API.', function () {
            assert.deepEqual(eventHelpers.getObjectForApiGetNormalizedName('太郎', '山田', 'ヤマダ'), {
                name: '山田 太郎',
                fields: 'firstName,lastName,correctReadingMatchCount',
                lastFurigana: 'ヤマダ'
            });
        });
    });
    describe('getObjectForApiRegisterEvent', function () {
        it('should return request object for API register event.', function () {
            assert.deepEqual(eventHelpers.getObjectForApiRegisterEvent(eventHelpersModule.basket, eventHelpersModule.normalizedNames(), eventHelpersModule.extraRaw), {
                info: {
                    hash_method: 'DIGEST_SHA_256',
                    request_datetime: 'yyyy/MM/dd HH:mm:ss',
                    shop_id: 'SP00WIREDBEANS',
                    signature: 'TEST',
                    version: '3.0'
                },
                telegram: {
                    event: {
                        ec: {
                            customers: {
                                buyer: {
                                    ID: '987',
                                    address: {
                                        addressA: 'テスト県',
                                        addressC: 'テスト市テスト区',
                                        country: 'JP',
                                        countryName: 'JAPAN',
                                        zipcode: '9800022'
                                    },
                                    birth_day: 'yyyy/MM/dd',
                                    company: {
                                        name: '',
                                        post: ''
                                    },
                                    email: {
                                        pc: {
                                            domain: 'test.co.jp',
                                            hashed_account_sha2: ''
                                        }
                                    },
                                    hashed_name: {
                                        alphabetCountInName: 0,
                                        first_name_sha2: 'TEST',
                                        hiraganaCountInName: 0,
                                        kanjiCountInName: 4,
                                        katakanaCountInName: 0,
                                        last_name_sha2: 'TEST',
                                        nameLength: 4,
                                        normalized_first_name_sha2: 'TEST',
                                        normalized_last_name_sha2: 'TEST',
                                        otherCountInName: 0,
                                        validName: '1',
                                        correctReading: '1',
                                        correctReadingMatchCount: 3
                                    },
                                    sex: 1,
                                    tel: {
                                        fixed_number: 'o123456789',
                                        mobile_number: '123'
                                    }
                                },
                                deliveries: [
                                    {
                                        ID: '987',
                                        address: {
                                            addressA: 'テスト県',
                                            addressC: 'テスト市テスト区',
                                            country: 'JP',
                                            countryName: 'JAPAN',
                                            zipcode: '9800022'
                                        },
                                        birth_day: 'yyyy/MM/dd',
                                        company: {
                                            name: '',
                                            post: ''
                                        },
                                        email: {
                                            pc: {
                                                domain: 'test.co.jp',
                                                hashed_account_sha2: ''
                                            }
                                        },
                                        hashed_name: {
                                            alphabetCountInName: 0,
                                            first_name_sha2: 'TEST',
                                            hiraganaCountInName: 0,
                                            kanjiCountInName: 4,
                                            katakanaCountInName: 0,
                                            last_name_sha2: 'TEST',
                                            nameLength: 4,
                                            normalized_first_name_sha2: 'TEST',
                                            normalized_last_name_sha2: 'TEST',
                                            otherCountInName: 0,
                                            validName: '1',
                                            correctReading: '1',
                                            correctReadingMatchCount: 3
                                        },
                                        sex: 1,
                                        tel: {
                                            fixed_number: 'o123456789',
                                            mobile_number: '123'
                                        }
                                    }
                                ]
                            },
                            items: [],
                            media_code: 'Web購入',
                            settle: {
                                amount: '3814',
                                credit_card: {
                                    bincode: '41111111'
                                },
                                datetime: 'yyyy/MM/dd HH:mm:ss',
                                limit_price: 999999,
                                method: '02',
                                status: '00'
                            }
                        },
                        event_id_for_shop: '987',
                        event_type: 'EC',
                        model_id: 'CRD_01'
                    }
                }
            });
        });
    });
    describe('getObjectForApiGetEvent', function () {
        it('should return opluxCancelledEmail.', function () {
            var eventObj = {
                'request.version': '1.0',
                'request.shop_id': 'SP00WIREDBEANS',
                'request.signiture': 'TEST',
                'request.hash_method': 'DIGEST_SHA_256',
                'request.request_datetime': 'yyyy/MM/dd HH:mm:ss',
                'request.fields': 'rules,score,similars,aaresult,maresult',
                'request.condition.event_id': '111'
            };
            assert.deepEqual(eventHelpers.getObjectForApiGetEvent('111'), eventObj);
        });
    });
    describe('getObjectForApiUpdateEvent', function () {
        it('should return object data for update event info API.', function () {
            var paramsObj = {
                settleStatus: '00',
                updateStatus: '10',
                memo: {},
                deleted: '1',
                blacked: null,
                black_customer_type: null,
                black_settle_category: null,
                black_other_category: null
            };
            var resultObj = {
                'request.version': '1.0',
                'request.shop_id': 'SP00WIREDBEANS',
                'request.signiture': 'TEST',
                'request.hash_method': 'DIGEST_SHA_256',
                'request.request_datetime': 'yyyy/MM/dd HH:mm:ss',
                request: {
                    condition: {
                        event_id: '12345'
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
            assert.deepEqual(eventHelpers.getObjectForApiUpdateEvent('12345', paramsObj), resultObj);
        });
    });
    describe('parseToJson', function () {
        it('should return object converted from JSON.', function () {
            assert.deepEqual(eventHelpers.parseToJson('{"TEST": "999"}'), { TEST: '999' });
        });
    });
    describe('parseToXML', function () {
        it('should return XML object if conversion is successful .', function () {
            var str = '<?xml version="1.0" encoding="UTF-8"?><response><time>122</time><result>20</result><errors><error><code>error.serverError</code><message>イベントIDが存在しません。</message></error></errors></response>';
            var resultObject = {
                object: {}
            };
            assert.deepEqual(eventHelpers.parseToXML(str), resultObject);
        });
        it('should return undefined if conversion fails .', function () {
            assert.equal(eventHelpers.parseToXML('TEST'), undefined);
        });
    });
    describe('getMockDataForServices', function () {
        it('should return mock object if service name is in constants.', function () {
            assert.deepEqual(eventHelpers.getMockDataForServices('oplux_name_services', 'GET'), {
                statusCode: 200,
                statusMessage: 'OK',
                text: JSON.stringify({
                    response: {
                        firstName: {
                            alphabet: null,
                            reading: null,
                            writing: '太郎 '
                        },
                        lastName: {
                            alphabet: null,
                            existed: true,
                            reading: null,
                            writing: 'モックテスト'
                        },
                        result: 'success',
                        letterCount: {
                            alphabetCountInName: 0,
                            hiraganaCountInName: 0,
                            kanjiCountInName: 2,
                            katakanaCountInName: 0,
                            nameLength: 8,
                            otherCountInName: 0
                        },
                        time: 42
                    }
                })
            });
        });
        it('should return API return mock object if service name is not in constants and method is GET.', function () {
            assert.deepEqual(eventHelpers.getMockDataForServices('TEST', 'GET'), {
                statusCode: 200,
                statusMessage: 'OK',
                text: '<response>' +
                    '<time>3059</time>' +
                    '<result>10</result>' +
                    '<errors/>' +
                    '<events>' +
                    '<event>' +
                    '<id>121102030247458037051F3D04342D7BF8D13D985CD46E6</id>' +
                    '<request_datetime>2012/11/02 11:59:41</request_datetime>' +
                    '<event_type>EC</event_type>' +
                    '<authori_deadline_datetime>2012/11/02 13:59:41</authori_deadline_datetime>' +
                    '<aaresult>' +
                    '<result>HOLD</result>' +
                    '</aaresult>' +
                    '<maresult>' +
                    '<reason></reason>' +
                    '</maresult>' +
                    '<score>' +
                    '<ok>0</ok>' +
                    '<ng>20000</ng>' +
                    '<hold>20500</hold>' +
                    '</score>' +
                    '<rules>' +
                    '<rule>' +
                    '<code>BLK_COK</code>' +
                    '<ok>0</ok>' +
                    '<ng>10000</ng>' +
                    '<hold>0</hold>' +
                    '<touchpoint>event.cookie</touchpoint>' +
                    '<fired>true</fired>' +
                    '</rule>' +
                    '<rule>' +
                    '<code>NEG_ITEM</code>' +
                    '<ok>0</ok>' +
                    '<ng>0</ng>' +
                    '<hold>10000</hold>' +
                    '<touchpoint>event.ec.customers.delivery.shipping.item.item_name</touchpoint>' +
                    '<fired>true</fired>' +
                    '</rule>' +
                    '</rules>' +
                    '<similars>' +
                    '<event_id>12102402471576345E9293C244E4E809E43E49D2E0C675D</event_id>' +
                    '<rule_code></rule_code>' +
                    '<touchpoints></touchpoints>' +
                    '</similars>' +
                    '</event>' +
                    '</events>' +
                    '</response>'
            });
        });
        it('should return API return mock object if service name is not in constants and method is PUT.', function () {
            assert.deepEqual(eventHelpers.getMockDataForServices('TEST', 'PUT'), {
                statusCode: 200,
                statusMessage: 'OK',
                text: '<response>' +
                    '<time>17</time>' +
                    '<result>10</result>' +
                    '<errors/>' +
                    '<id>17022018534007809833EA7A236414B91EB0DDABEA41D76</id>' +
                    '</response>'
            });
        });
        it('should return API return mock object if service name is not in constants and method is POST.', function () {
            assert.deepEqual(eventHelpers.getMockDataForServices('TEST', 'POST'), {
                statusCode: 200,
                statusMessage: 'OK',
                text: JSON.stringify({
                    "time": 74,
                    "result": 10,
                    "telegram": {
                        "event" : {
                            "id" : "2403121546078893B28E6CDC23044769F6E27470264C678",
                            "aaresult" : {
                                "result" : "OK"
                            },
                            "rules" : [ {
                                "code" : "SEI_FURIGANA_MATCH_2",
                                "description" : "購入者苗字ふりがな誤り（一致文字数が2文字未満）"
                            }, {
                                "code" : "SEI_FURIGANA_DLVR",
                                "description" : "配送先苗字ふりがな誤り"
                            }, {
                                "code" : "TEST_OKTEL",
                                "touchpoint" : "event.ec.customers.buyer.tel.fixed_number",
                                "description" : "テスト用の強制審査結果OK（TEL1末尾が0）"
                            }, {
                                "code" : "SEI_FURIGANA",
                                "description" : "購入者苗字ふりがな誤り"
                            }, {
                                "code" : "SEI_FURIGANA_DLVR_MATCH_2",
                                "description" : "配送先苗字ふりがな誤り（一致文字数が2文字未満）"
                            } ],
                            "similars" : [ {
                                "event_id" : "2402291914051677180EDE9F1A34EA7B0229792AD342467",
                                "event_id_for_shop" : "2a674287d57733caf37987f60c"
                            }, {
                                "event_id" : "240229184318779AF98FF31F31B4279BE1D58441655ABA8",
                                "event_id_for_shop" : "fa256bc130539775e925822ba5"
                            }, {
                                "event_id" : "24022918394515605CE48A82410479E8EDAA85E086B88E1",
                                "event_id_for_shop" : "cd911a5043c38a456ea51d9515"
                            }, {
                                "event_id" : "240229182744331B65F6DA7D397499BAB65D49150F308E2",
                                "event_id_for_shop" : "905e50cea6570aa828d8190099"
                            }, {
                                "event_id" : "24022918212971977236577D7DC4A6D98460AA76B3D3D8C",
                                "event_id_for_shop" : "049deaed2bab29c6c3b8455121"
                            }, {
                                "event_id" : "24022918190564491ACA9CC6003449D99D079BBC3DC7D7F",
                                "event_id_for_shop" : "dc052b02284beb88bf2fdd2856"
                            }, {
                                "event_id" : "240229181806483A7A08F3FE4744972A93DEF3282DC96DE",
                                "event_id_for_shop" : "dc052b02284beb88bf2fdd2856"
                            }, {
                                "event_id" : "240229181135375DBE0ACAB57FF44489D3D150C52605341",
                                "event_id_for_shop" : "161528af396188c9d7fb480a54"
                            }, {
                                "event_id" : "24022918062572435A78A2547A545F2BB1D87F396A2436A",
                                "event_id_for_shop" : "52d6e444bdb08ab28f2136df87"
                            }, {
                                "event_id" : "240229180155964B8597A1AF3D0486DB3CCF46788588779",
                                "event_id_for_shop" : "52d6e444bdb08ab28f2136df87"
                            }, {
                                "event_id" : "2402291739017846E269563F3E84053A78DA7A5F1059894",
                                "event_id_for_shop" : "050d8159be31e9b967e0b4c1be"
                            }, {
                                "event_id" : "24022917324501565ADDAEFF9FD4546912B22B365DD4A07",
                                "event_id_for_shop" : "4705655a57ce5351a3e64c1b86"
                            }, {
                                "event_id" : "240229172900360DDFC115434FF4BDE949D68469E60328E",
                                "event_id_for_shop" : "4705655a57ce5351a3e64c1b86"
                            }, {
                                "event_id" : "24022917260768565FDADF3CA314E26B40DD23504F26AAE",
                                "event_id_for_shop" : "4705655a57ce5351a3e64c1b86"
                            }, {
                                "event_id" : "240229172106772B8CCF4BAA3A14C5E8FBEE3581E269B83",
                                "event_id_for_shop" : "4705655a57ce5351a3e64c1b86"
                            }, {
                                "event_id" : "2402291642152492E823B554FA548E6A8CC2CFC8BD40D6B",
                                "event_id_for_shop" : "4705655a57ce5351a3e64c1b86"
                            }, {
                                "event_id" : "240229163804191AD891CF2F2C440B4A3488ED77487E068",
                                "event_id_for_shop" : "4705655a57ce5351a3e64c1b86"
                            }, {
                                "event_id" : "240229162545752143D3BC16A76485AA23723CFE71F9D07",
                                "event_id_for_shop" : "4705655a57ce5351a3e64c1b86"
                            }, {
                                "event_id" : "240229162058064EB0F062FE1CA498C8F24C226D34D2BF9",
                                "event_id_for_shop" : "7dbae173a17a459952a4c0bc0a"
                            }, {
                                "event_id" : "240229154420193B69C3593ABD24BDFB8DB6EB0DB24B0DE",
                                "event_id_for_shop" : "0cf9861decce19e82cc434b915"
                            } ],
                            "rule_group" : "優先度3_OK_ルール単発"
                            }
                    }
                })
            });
        });
        it('should return API return mock object if service name is not in constants and method is otherwise.', function () {
            assert.deepEqual(eventHelpers.getMockDataForServices('TEST', 'TEST'), {
                statusCode: 200,
                statusMessage: 'OK',
                text: '<response>' +
                    '<time>3059</time>' +
                    '<result>10</result>' +
                    '<errors/>' +
                    '<events>' +
                    '<event>' +
                    '<id>121102030247458037051F3D04342D7BF8D13D985CD46E6</id>' +
                    '<request_datetime>2012/11/02 11:59:41</request_datetime>' +
                    '<event_type>EC</event_type>' +
                    '<authori_deadline_datetime>2012/11/02 13:59:41</authori_deadline_datetime>' +
                    '<aaresult>' +
                    '<result>HOLD</result>' +
                    '</aaresult>' +
                    '<maresult>' +
                    '<reason></reason>' +
                    '</maresult>' +
                    '<score>' +
                    '<ok>0</ok>' +
                    '<ng>20000</ng>' +
                    '<hold>20500</hold>' +
                    '</score>' +
                    '<rules>' +
                    '<rule>' +
                    '<code>BLK_COK</code>' +
                    '<ok>0</ok>' +
                    '<ng>10000</ng>' +
                    '<hold>0</hold>' +
                    '<touchpoint>event.cookie</touchpoint>' +
                    '<fired>true</fired>' +
                    '</rule>' +
                    '<rule>' +
                    '<code>NEG_ITEM</code>' +
                    '<ok>0</ok>' +
                    '<ng>0</ng>' +
                    '<hold>10000</hold>' +
                    '<touchpoint>event.ec.customers.delivery.shipping.item.item_name</touchpoint>' +
                    '<fired>true</fired>' +
                    '</rule>' +
                    '</rules>' +
                    '<similars>' +
                    '<event_id>12102402471576345E9293C244E4E809E43E49D2E0C675D</event_id>' +
                    '<rule_code></rule_code>' +
                    '<touchpoints></touchpoints>' +
                    '</similars>' +
                    '</event>' +
                    '</events>' +
                    '</response>'
            });
        });
    });
    describe('eventRegistrationResultHandler', function () {
        it('should return null if basket is null.', function () {
            var extraRaw = {
                telegram: {
                    event: {
                        device_info: 'device_info'
                    }
                }
            };
            assert.deepEqual(eventHelpers.eventRegistrationResultHandler(null, eventHelpersModule.successfullyOpluxResult, extraRaw), null);
        });
        it('should return null if opluxResult is null.', function () {
            var extraRaw = {
                telegram: {
                    event: {
                        device_info: 'device_info'
                    }
                }
            };
            assert.deepEqual(eventHelpers.eventRegistrationResultHandler(eventHelpersModule.eventRegistrationResultBasket, null, extraRaw), null);
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
            var extraRaw = {
                telegram: {
                    event: {
                        device_info: 'device_info'
                    }
                }
            };
            assert.deepEqual(eventHelpers.eventRegistrationResultHandler(eventHelpersModule.eventRegistrationResultBasket, eventHelpersModule.successfullyOpluxResult, extraRaw), successResultObject);
        });
        it('should return API event registration failed result object.', function () {
            var failedResultObject = {
                success: false,
                responseResult: '20',
                errorMsg: '[yyyy/MM/dd HH:mm:ss] opluxResult.isOk is not a function'
            };
            var extraRaw = {
                telegram: {
                    event: {
                        device_info: 'device_info'
                    }
                }
            };
            assert.deepEqual(eventHelpers.eventRegistrationResultHandler(eventHelpersModule.eventRegistrationResultBasket, eventHelpersModule.failOpluxResult, extraRaw), failedResultObject);
        });
    });
    describe('updateBasketOpluxExaminationResult', function () {
        it('should return undefined if API response is null or undefined.', function () {
            var basket = {
                custom: {
                    oplux_event_api_response_json: '{"TEST": "999"}'
                },
                paymentInstruments: [{
                    empty: false,
                    paymentMethod: 'CREDIT_CARD'
                }]
            };
            assert.equal(eventHelpers.updateBasketOpluxExaminationResult(basket), undefined);
        });
    });
});
