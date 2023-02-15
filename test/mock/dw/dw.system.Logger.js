'use strict';

/**
 * @module test/mock/dw/dw.system.Logger.js
 */

module.exports = {
    getLogger: function () {
        return {
            info: function () { },
            debug: function () { },
            warn: function () { },
            error: function () { }
        };
    }
};
