'use strict';

/**
 * @module test/mock/dw/dw.io.Reader.js
 */

function Reader(text) {
    if(text === 'TEST') return {}
    return {
        readLines : function () {
            return {
                toArray: function () {
                    return text.split('\r\n');
                }
            };
        },
        close : function () {}
    }
}

module.exports = Reader;
