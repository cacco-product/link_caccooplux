'use strict';

var ContentMgr = require('dw/content/ContentMgr');

/**
 * Replace Content email
 * @param {string} contentName - content name
 * @param {Object} params - params to replace
 * @returns {string} String after replace
 */
function getReplaceContent(contentName, params) {
    var contentReturn = 'Does not exist content ' + contentName;
    var contentAsset = ContentMgr.getContent(contentName);

    if (contentAsset != null) {
        if ('body' in contentAsset.custom && contentAsset.custom.body != null) {
            var contentBody = contentAsset.custom.body.markup;
            for (var property in params) {
                var replaceContent = params[property].toString().replace(/\r\n/g, '<br>');
                contentBody = contentBody.split('[' + property + ']').join(replaceContent);
            }
            contentReturn = contentBody;
        } else {
            contentReturn = '';
        }
    }

    return contentReturn;
}

/**
 * Get email title by content name
 * @param {string} contentName - content name
 * @returns {string} email title
 */
function getEmailTitle(contentName) {
    var contentAsset = ContentMgr.getContent(contentName);

    return contentAsset.name;
}

module.exports = {
    getReplaceContent: getReplaceContent,
    getEmailTitle: getEmailTitle
};
