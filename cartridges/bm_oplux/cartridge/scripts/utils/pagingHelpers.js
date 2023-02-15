/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable require-jsdoc */

'use strict';

/**
 * GetPagingInfo
 * @param {Object} pagingmodel - pdict.pagingmodel
 * @param {string} pageURL - pdict.pageurl
 * @returns {Object}
 */
 function getPagingInfo(pagingmodel, pageURL) {
    var current = pagingmodel.start;
    var totalCount = pagingmodel.count;
    var pageSize = pagingmodel.pageSize;

    var pageIndex = pageURL.indexOf('&start=');
    if(pageIndex > -1){
        pageURL = pageURL.substring(0, pageIndex);
    }
    var pagingUrl = pageURL;
    var szIndex = pageURL.indexOf('&sz=');
    if(szIndex > -1) {
        pageURL = pageURL.substring(0, szIndex);
    }

    var currentPage = pagingmodel.currentPage;
    var maxPage = pagingmodel.maxPage;

    var showingStart = current + 1;
    var showingEnd = current + pageSize;

    if (showingEnd > totalCount) {
        showingEnd = totalCount;
    }
    
    var rangeBegin = 0;
    var rangeEnd  = maxPage;

    var lr = 2; // number of explicit page links to the left and right
    if (maxPage <= 2 * lr) {
        rangeBegin = 0;
        rangeEnd = maxPage;
    } else {
        rangeBegin = Math.max(Math.min(currentPage - lr, maxPage - 2 * lr), 0);
        rangeEnd = Math.min(rangeBegin + 2 * lr, maxPage);
    }

    return {
        totalCount: totalCount,
        pageSize: pageSize,
        showingStart: showingStart,
        showingEnd: showingEnd,
        pageURL: pageURL,
        maxPage: maxPage,
        pagingUrl: pagingUrl,
        current: current,
        currentPage: currentPage,
        rangeBegin: rangeBegin,
        rangeEnd: rangeEnd
    }
 }

module.exports = {
    getPagingInfo: getPagingInfo
};
