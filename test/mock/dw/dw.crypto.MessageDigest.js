'use strict';

/**
 * @module test/mock/dw/dw.crypto.MessageDigest.js
 */
/**
 * messageDigest Class.
 *
 * @returns {Class} It returns messageDigest class.
 */
function messageDigest() {
    var messageDigestFunctions = function () {
        this.digestBytes = function () {};
    };

    return messageDigestFunctions;
}

module.exports = messageDigest();
