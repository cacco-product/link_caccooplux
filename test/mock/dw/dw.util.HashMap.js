'use strict';

/**
 * @module test/mock/dw/dw.util.HashMap.js
 */

/**
 * HashMap Class.
 */
function HashMap() {
    this.store = {};
    this.put = function (key, val) {
        this.store[key] = val;
    };
}

module.exports = HashMap;
