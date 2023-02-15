'use strict';

/**
 * @module test/mock/dw/dw.web.PagingModel.js
 */

/**
 * Mail Class.
 *
 * @returns {Class} It returns PagingModel class.
 */
function PagingModel() {
    var pagingModelFunctions = function () {
        this.setPageSize = function (pageSize) {
            return pageSize;
        };
        this.setStart = function (start) {
            return start;
        };
    };

    return pagingModelFunctions;
}

module.exports = PagingModel();
