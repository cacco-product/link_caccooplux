'use strict';

/**
 * @module test\mock\bm_oplux\cartridge\controllers\OpluxAdmin.js
 */

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

module.exports = {
    requireOpluxAdmin: function () {
        return proxyquire(
            '../../../../../cartridges/bm_oplux/cartridge/controllers/OpluxAdmin',
            {
                'dw/system/Logger': require('../../../../../test/mock/dw/dw.system.Logger'),
                'dw/template/ISML': require('../../../../../test/mock/dw/dw.template.ISML'),
                'dw/web/PagingModel': require('../../../../../test/mock/dw/dw.web.PagingModel'),
                '~/cartridge/models/opluxModels': require('../../../../../test/mock/bm_oplux/cartridge/models/opluxModels.js'),
                '~/cartridge/scripts/utils/response': require('../../../../../test/mock/bm_oplux/cartridge/scripts/utils/response'),
                '~/cartridge/scripts/utils/helpers': require('../../../../../test/mock/bm_oplux/cartridge/scripts/utils/helpers'),
                '*/cartridge/scripts/utils/constants': require('../../../../../test/mock/int_oplux/cartridge/scripts/utils/constants')
            }
        );
    }
};
