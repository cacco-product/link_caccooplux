'use strict';

/**
 * @module test/mock/dw/dw.util.Mail.js
 */

/**
 * Mail Class.
 *
 * @returns {Class} It returns mail class.
 */
function Mail() {
    var mailFunctions = function () {
        this.addTo = function () {};
        this.setSubject = function () {};
        this.setFrom = function () {};
        this.setContent = function () {};
        this.send = function () {};
    };

    return mailFunctions;
}

module.exports = Mail();
