'use strict';

/**
 * @module test\mock\bm_oplux\cartridge\models\opluxModels.js
 */

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

module.exports = {
    requireOpluxModels: function () {
        return proxyquire(
            '../../../../../cartridges/bm_oplux/cartridge/models/opluxModels.js',
            {
                'dw/system/Logger': require('../../../../../test/mock/dw/dw.system.Logger'),
                'dw/content/ContentMgr': require('../../../../../test/mock/dw/dw.content.ContentMgr'),
                '*/cartridge/scripts/utils/constants': require('../../../../../test/mock/int_oplux/cartridge/scripts/utils/constants'),
                'dw/util/Calendar': require('../../../../../test/mock/dw/dw.util.Calendar'),
                'dw/util/StringUtils': require('../../../../../test/mock/dw/dw.util.StringUtils'),
                'dw/order/Order': require('../../../../../test/mock/dw/dw.order.Order'),
                'dw/order/OrderMgr': require('../../../../../test/mock/dw/dw.order.OrderMgr'),
                'dw/util/ArrayList': require('../../../../../test/mock/dw/dw.util.ArrayList'),
                'dw/system/Site': require('../../../../../test/mock/dw/dw.system.Site')
            }
        );
    },
    getOrders: function () {
        return {
            orders: {
                getLength: function () {
                    return 100;
                }
            },
            isOverSize: ''
        };
    },
    getOrderById: function () {
        return {
            customerLocaleID: {
                getLength: function () {
                    return 100;
                }
            },
            custom: {
                oplux_device_info: '',
                oplux_event_id: '',
                oplux_black_customer_type: {
                    value: {
                        toString: function () {}
                    }
                }
            },
            getRemoteHost: function () {
                return 100;
            },
            status: {
                toString: function () {}
            }
        };
    }
};
