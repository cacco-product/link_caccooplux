'use strict';

/**
 * @module test\mock\bm_oplux\cartridge\scripts\utils\helpers.js
 */

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

module.exports = {
    requireHelpers: function () {
        return proxyquire(
            '../../../../../../cartridges/bm_oplux/cartridge/scripts/utils/helpers.js',
            {
                'dw/util/Calendar': require('../../../../../../test/mock/dw/dw.util.Calendar'),
                'dw/util/StringUtils': require('../../../../../../test/mock/dw/dw.util.StringUtils'),
                'dw/system/Transaction': require('../../../../../../test/mock/dw/dw.system.Transaction'),
                'dw/order/Order': require('../../../../../../test/mock/dw/dw.order.Order'),
                'dw/system/Logger': require('../../../../../../test/mock/dw/dw.system.Logger'),
                '*/cartridge/scripts/utils/constants': require('../../../../../../test/mock/int_oplux/cartridge/scripts/utils/constants'),
                '*/cartridge/scripts/utils/eventHelpers': require('../../../../../../test/mock/int_oplux/cartridge/scripts/utils/eventHelpers'),
                '*/cartridge/scripts/utils/opluxServices': require('../../../../../mock/int_oplux/cartridge/scripts/utils/opluxServices'),
                '*/cartridge/scripts/utils/opluxCallHelpers': require('../../../../../mock/int_oplux/cartridge/scripts/utils/opluxCallHelpers')
            }
        );
    },
    eventRegistration: function () {
        return {};
    },
    eventRegistrationResultHandler: function () {
        return {};
    },
    orderStatusHandler: function () {
        return {};
    },
    updateEventInfo: function () {
        return {};
    },
    eventUpdateResultHandler: function () {
        return {};
    }
};
