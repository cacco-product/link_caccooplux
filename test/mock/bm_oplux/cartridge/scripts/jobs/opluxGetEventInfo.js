'use strict';

/**
 * @module test\mock\bm_oplux\cartridge\scripts\jobs\opluxGetEventInfo.js
 */

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

module.exports = {
    requireOpluxGetEventInfo: function () {
        return proxyquire(
            '../../../../../../cartridges/bm_oplux/cartridge/scripts/jobs/opluxGetEventInfo.js',
            {
                'dw/content/ContentMgr': require('../../../../../../test/mock/dw/dw.content.ContentMgr'),
                'dw/util/Calendar': require('../../../../../../test/mock/dw/dw.util.Calendar'),
                'dw/order/Order': require('../../../../../../test/mock/dw/dw.order.Order'),
                'dw/system/Transaction': require('../../../../../../test/mock/dw/dw.system.Transaction'),
                'dw/util/StringUtils': require('../../../../../../test/mock/dw/dw.util.StringUtils'),
                'dw/system/Logger': require('../../../../../../test/mock/dw/dw.system.Logger'),
                '*/cartridge/scripts/utils/constants': require('../../../../../../test/mock/int_oplux/cartridge/scripts/utils/constants'),
                'dw/order/OrderMgr': require('../../../../../../test/mock/dw/dw.order.OrderMgr'),
                '*/cartridge/scripts/utils/opluxServices': require('../../../../../mock/int_oplux/cartridge/scripts/utils/opluxServices'),
                '*/cartridge/scripts/opluxOrderMgr': require('../../../../../mock/int_oplux/cartridge/scripts/utils/opluxServices')
            }
        );
    }
};
