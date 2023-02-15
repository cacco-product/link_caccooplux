'use strict';

/**
 * @module test\mock\int_oplux\cartridge\scripts\utils\opluxServices.js
 */

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

module.exports = {
    requireOpluxServices: function () {
        return proxyquire(
            '../../../../../../cartridges/int_oplux/cartridge/scripts/utils/opluxServices',
            {
                'dw/system/Logger': require('../../../../../../test/mock/dw/dw.system.Logger'),
                'dw/svc': require('../../../../../../test/mock/dw/dw.svc'),
                '~/cartridge/scripts/utils/constants': require('../../../../../../test/mock/int_oplux/cartridge/scripts/utils/constants'),
                '~/cartridge/scripts/utils/eventHelpers': require('../../../../../../test/mock/int_oplux/cartridge/scripts/utils/eventHelpers')
            }
        );
    },
    getNormalizedName: function () {
        return {
            getObject: function () {
                return '{"response":{"firstName":{"alphabet":null,"reading":null,"writing":"太郎"},"lastName":{"alphabet":null,"existed":true,"reading":null,"writing":"山田"},"result":"success","letterCount":{"alphabetCountInName":0,"hiraganaCountInName":0,"kanjiCountInName":4,"katakanaCountInName":0,"nameLength":4,"otherCountInName":0},"time":1}}';
            }
        };
    },
    getEventInfo: function () {
        return {
            isOk: function () {
                return true;
            },
            getStatus: function () {},
            getErrorMessage: function () {},
            getError: function () {},
            getMsg: function () {},
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
            }
        };
    },
    registerEvent: function () {
        return {
            ok: true,
            status: 'OK',
            object: { checkoutSessionId: '12345-12345' },
            getErrorMessage: '',
            getObject: '',
            getStatus: '',
            isOk: true
        };
    },
    updateEventInfo: function (eventId, extraRaw) {
        if (!eventId) {
            return null;
        }
        return {
            ok: true,
            status: 'OK',
            object: { checkoutSessionId: '12345-12345' },
            getErrorMessage: '',
            getObject: '',
            getStatus: '',
            isOk: true
        };
    }
};
