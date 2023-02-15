'use strict';

/**
 * @module test/mock/dw/dw.util.ArrayList.js
 */

/**
 * ArrayList Class.
 *
 * @returns {Class} It returns ArrayList class.
 */
function arrayList() {
    var arrFunctions = function () {
        this.push = function () {};
        this.getLength = function () {
            return 30000;
        };
    };

    return arrFunctions;
}

module.exports = arrayList();
