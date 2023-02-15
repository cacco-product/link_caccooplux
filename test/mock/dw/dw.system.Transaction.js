'use strict';

/**
 * @module test/mock/dw/dw.system.Transaction.js
 */

module.exports = {
    wrap: function (method) {
        method();
    }
};
