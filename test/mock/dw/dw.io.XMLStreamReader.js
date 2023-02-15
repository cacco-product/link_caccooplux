'use strict';

/**
 * @module test/mock/dw/dw.io.XMLStreamReader.js
 */

function XMLStreamReader(responseReader) {
    responseReader.readLines();
    return {
        readXMLObject: function () {
            return { object: {} };
        },
        close: function () { },
        hasNext: function () {
            return true;
        },
        next: function () {
            return '<?xml version="1.0" encoding="UTF-8" ?>';
        }
    };
}

module.exports = XMLStreamReader;
