/* eslint-disable valid-jsdoc */
'use strict';
/**
 * This module provides often-needed helper methods for sending responses.
 */
exports.renderJSON = function (object) {
    response.setContentType('application/json');
    var json = JSON.stringify(object);
    response.writer.print(json);
};
