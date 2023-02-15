'use strict';

/**
 * @module test\mock\int_oplux\cartridge\scripts\utils\opluxCallHelpers.js
 */

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

module.exports = {
    proxyQuireOpluxCallHelpers: function () {
        return proxyquire(
            '../../../../../../cartridges/int_oplux/cartridge/scripts/utils/opluxCallHelpers',
            {
                'dw/system/Transaction': require('../../../../../../test/mock/dw/dw.system.Transaction'),
                'dw/system/Logger': require('../../../../../../test/mock/dw/dw.system.Logger'),
                '*/cartridge/scripts/utils/eventHelpers': require('../../../../../../test/mock/int_oplux/cartridge/scripts/utils/eventHelpers'),
                '*/cartridge/scripts/utils/constants': require('../../../../../../test/mock/int_oplux/cartridge/scripts/utils/constants'),
                '*/cartridge/scripts/utils/opluxServices': require('../../../../../../test/mock/int_oplux/cartridge/scripts/utils/opluxServices')
            }
        );
    },
    successfulRequest: function () {
        return {
            info: {
                version: '3.0',
                shop_id: 'SP00WIREDBEANS',
                signature: '168364F449E6F02E30AFD95E9CB355009AC1AE1A9FDA4DBC681FC480F9FC35B4',
                hash_method: 'SHA256',
                request_datetime: '2022/03/18 16:35:33'
            },
            telegram: {
                event: {
                    model_id: 'CRD_01',
                    event_id_for_shop: '3f92b6c445e5298da1a078a7a7',
                    event_type: 'EC',
                    ec: {
                        media_code: 'Web購入･',
                        settle: {
                            limit_price: '999999',
                            status: '00',
                            datetime: '2022/03/18 16:35:33',
                            amount: '3814',
                            method: '02',
                            credit_card: {
                                bincode: '411111'
                            }
                        },
                        customers: {
                            buyer: {
                                hashed_name: {
                                    first_name_sha2: 'C731D803E8C6FCDE1563FDA8BF4BBBCC5CF25D3BB27945DAA1529FA6D966861C',
                                    normalized_first_name_sha2: 'C731D803E8C6FCDE1563FDA8BF4BBBCC5CF25D3BB27945DAA1529FA6D966861C',
                                    last_name_sha2: 'E87974CBDD0EF7D1AB644CCB0BD4B47A2CD183F2814F0981435D12238491B330',
                                    normalized_last_name_sha2: 'E87974CBDD0EF7D1AB644CCB0BD4B47A2CD183F2814F0981435D12238491B330',
                                    nameLength: 5,
                                    kanjiCountInName: 5,
                                    hiraganaCountInName: '',
                                    katakanaCountInName: '',
                                    alphabetCountInName: '',
                                    otherCountInName: '',
                                    validName: '1'
                                },
                                address: {
                                    country: 'JP',
                                    countryName: 'JAPAN',
                                    zipcode: '9800022',
                                    addressA: '宮城県',
                                    addressC: '仙台市青葉区五橋'
                                },
                                tel: {
                                    fixed_number: '0223808680',
                                    mobile_number: ''
                                },
                                email: {
                                    pc: {
                                        hashed_account_sha2: '8F3F59EE2D2B268C219405657E4F374E264B6D78E976C2645E11333F54E2AE33',
                                        domain: 'wiredbeans.co.jp'
                                    }
                                }
                            },
                            deliveries: [
                                {
                                    hashed_name: {
                                        first_name_sha2: 'C731D803E8C6FCDE1563FDA8BF4BBBCC5CF25D3BB27945DAA1529FA6D966861C',
                                        normalized_first_name_sha2: 'C731D803E8C6FCDE1563FDA8BF4BBBCC5CF25D3BB27945DAA1529FA6D966861C',
                                        last_name_sha2: 'E87974CBDD0EF7D1AB644CCB0BD4B47A2CD183F2814F0981435D12238491B330',
                                        normalized_last_name_sha2: 'E87974CBDD0EF7D1AB644CCB0BD4B47A2CD183F2814F0981435D12238491B330',
                                        nameLength: 5,
                                        kanjiCountInName: 5,
                                        hiraganaCountInName: '',
                                        katakanaCountInName: '',
                                        alphabetCountInName: '',
                                        otherCountInName: '',
                                        validName: '1'
                                    },
                                    address: {
                                        country: 'JP',
                                        countryName: 'JAPAN',
                                        zipcode: '9800022',
                                        addressA: '宮城県',
                                        addressC: '仙台市青葉区五橋'
                                    },
                                    tel: {
                                        fixed_number: '0223808680',
                                        mobile_number: ''
                                    },
                                    email: {
                                        pc: {
                                            hashed_account_sha2: '8F3F59EE2D2B268C219405657E4F374E264B6D78E976C2645E11333F54E2AE33',
                                            domain: 'wiredbeans.co.jp'
                                        }
                                    }
                                }
                            ]
                        },
                        items: [
                            {
                                shop_item_id: '682875090845M',
                                item_price: 3616,
                                item_quantity: 1,
                                item_name: 'チェック地シルクタイ',
                                item_category: 'ネクタイ'
                            }
                        ]
                    },
                    device_info: 'OK;:Mozilla;:undefined;:Netscape;:5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36;:undefined;:zzoy-002.sandbox.us01.dx.commercecloud.salesforce.com#20220202164523ExxVC;:true;:undefined;:zzoy-002.sandbox.us01.dx.commercecloud.salesforce.com;:undefined;:https://zzoy-002.sandbox.us01.dx.commercecloud.salesforce.com/on/demandware.store/Sites-RefArch-Site/ja_JP/Checkout-Begin;:zzoy-002.sandbox.us01.dx.commercecloud.salesforce.com;:false;:ja;:1647588610248;:pdf_pdf;:true;:undefined;:/on/demandware.store/Sites-RefArch-Site/ja_JP/Checkout-Begin;:Win32;:PDF Viewer-undefined_Chrome PDF Viewer-undefined_Chromium PDF Viewer-undefined_Microsoft Edge PDF Viewer-undefined_WebKit built-in PDF-undefined;:;:20030107;:https://zzoy-002.sandbox.us01.dx.commercecloud.salesforce.com/s/RefArch/cart?lang=ja_JP;:undefined;:undefined;:24;:1080;:1920;:undefined;:;:-540;:undefined;:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36;:undefined;:undefined;:undefined',
                    ip_address_only: '101.128.231.119'
                }
            }
        };
    },
    getNormalizedNames: function () {
        return {
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
        };
    }
};
