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
            assert.deepEqual(eventHelpers.getObjectForApiGetNormalizedName('太郎', '山田'), {
                name: '山田 太郎',
                fields: 'firstName,lastName'
            });
        });
    });
    describe('getObjectForApiRegisterEvent', function () {
        it('should return request object for API register event.', function () {
            assert.deepEqual(eventHelpers.getObjectForApiRegisterEvent(eventHelpersModule.basket, eventHelpersModule.normalizedNames, eventHelpersModule.extraRaw), {
                info: {
                    hash_method: 'DIGEST_SHA_256',
                    request_datetime: 'YYYY/MM/dd HH:mm:ss',
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
                                        alphabetCountInName: '',
                                        first_name_sha2: 'TEST',
                                        hiraganaCountInName: '',
                                        kanjiCountInName: '',
                                        katakanaCountInName: '',
                                        last_name_sha2: 'TEST',
                                        nameLength: '',
                                        normalized_first_name_sha2: 'TEST',
                                        normalized_last_name_sha2: 'TEST',
                                        otherCountInName: '',
                                        validName: '0'
                                    },
                                    sex: '3',
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
                                            alphabetCountInName: '',
                                            first_name_sha2: 'TEST',
                                            hiraganaCountInName: '',
                                            kanjiCountInName: '',
                                            katakanaCountInName: '',
                                            last_name_sha2: 'TEST',
                                            nameLength: '',
                                            normalized_first_name_sha2: 'TEST',
                                            normalized_last_name_sha2: 'TEST',
                                            otherCountInName: '',
                                            validName: '0'
                                        },
                                        sex: '3',
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
                                    bincode: '411111'
                                },
                                datetime: 'YYYY/MM/dd HH:mm:ss',
                                limit_price: '999999',
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
                'request.request_datetime': 'YYYY/MM/dd HH:mm:ss',
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
                'request.request_datetime': 'YYYY/MM/dd HH:mm:ss',
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
                text: '<response>' +
                    '<time>4007</time>' +
                    '<result>20</result>' +
                    '<errors/>' +
                    '<event>' +
                    '<id>140611022211204FBEA7CF83A494A7288D02D98AE30F9B3</id>' +
                    '<result>NG</result>' +
                    '<skipped>0</skipped>' +
                    '<score>' +
                    '<ok>0</ok>' +
                    '<ng>0</ng>' +
                    '<hold>48500</hold>' +
                    '</score>' +
                    '<rules>' +
                    '<rule>' +
                    '<code>NEG_ITEM</code>' +
                    '<ok>0</ok>' +
                    '<ng>0</ng>' +
                    '<hold>10000</hold>' +
                    '<touchpoint>event.ec.customers.delivery.shipping.item.item_name</touchpoint>' +
                    '<description>決済金額が閾値以上、かつ、購入商品名にネガティブワードが含まれる場合に発動。 </description>' +
                    '</rule>' +
                    '<rule>' +
                    '<code>PAID_MOBMAIL</code>' +
                    '<ok>0</ok>' +
                    '<ng>0</ng>' +
                    '<hold>500</hold>' +
                    '<touchpoint>event.ec.customers.buyer.email.mobile.domain,event.ec.customers.buyer.email.mobile.hashed_account</touchpoint>' +
                    '<description>支払い済みの過去イベントを、携帯電話メールアドレスをキーとして検索し、一致件数が閾値以上の場合に発動。 </description>' +
                    '</rule>' +
                    '</rules>' +
                    '<similars>' +
                    '<similar>' +
                    '<event_id>140407030052358A191F21F4CC04346BBF0FE27DA41801B</event_id>' +
                    '<rule_code></rule_code>' +
                    '<touchpoints></touchpoints>' +
                    '</similar>' +
                    '<similar>' +
                    '<event_id>1208270637569454CEB14A400F649B080FF5793E5DE35BC</event_id>' +
                    '<rule_code></rule_code>' +
                    '<touchpoints></touchpoints>' +
                    '</similar>' +
                    '</similars>' +
                    '</event>' +
                    '</response>'
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
                errorMsg: '[YYYY/MM/dd HH:mm:ss] opluxResult.isOk is not a function'
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
