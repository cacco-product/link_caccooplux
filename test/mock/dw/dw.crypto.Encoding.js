'use strict';

/**
 * @module test/mock/dw/dw.crypto.Encoding.js
 */

module.exports = {
    toHex: function () {
        return {
            toUpperCase: function () {
                return 'TEST';
            }
        };
    }
};
