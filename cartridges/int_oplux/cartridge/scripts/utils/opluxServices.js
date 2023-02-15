/* eslint-disable require-jsdoc */

'use strict';

var OPLUX_LOGGER = require('dw/system/Logger').getLogger('OPLUX', 'O-PLUX');

/**
 * @param {string} serviceName
 * @param {string} method
 * @returns {Object} service
 */
function getWebService(serviceName, method) {
    var svc = require('dw/svc');
    var constants = require('~/cartridge/scripts/utils/constants');
    var service = null;
    try {
        service = svc.LocalServiceRegistry.createService(serviceName, {
            createRequest: function (svc, args) {
                svc.setRequestMethod(method);
                if(serviceName === constants.OPLUX_EVENT_API_V2) {
                    svc.addHeader('Content-Type', 'application/x-www-form-urlencoded');
                }
                else if(serviceName === constants.OPLUX_EVENT_API_V3) {
                    svc.addHeader('Content-Type', 'application/json');
                }
                svc.addHeader('charset', 'UTF-8');
                if (args) {
                    OPLUX_LOGGER.info('serviceName: {0}', serviceName);
                    return args;
                }
                return null;
            },
            parseResponse: function (svc, res) {
                if (serviceName === constants.OPLUX_EVENT_API_V3) {
                    return JSON.parse(res.text);
                }
                else {
                    return res.text;
                }
            },
            getRequestLogMessage: function (request) {
                return JSON.stringify(request);
            },
            getResponseLogMessage: function (response) {
                return response.text;
            },
            filterLogMessage: function (msg) {
                return msg
                    .replace(/(buyer.*?=)(.*?)(?=&|$)/g, '$1***')
                    .replace(/(deliveries.*?=)(.*?)(?=&|$)/g, '$1***');
            },
            mockCall: function (svc, args) {
                var helper = require('~/cartridge/scripts/utils/eventHelpers');
                return helper.getMockDataForServices(serviceName, method);
            }
        });
    } catch (e) {
        OPLUX_LOGGER.error('getWebService {0} exception: {1}', serviceName, e.message);
    }

    return service;
}
/**
 * @param {Object} webService
 * @param {Object} params
 * @returns {Object} response - Response of registerEvent API
 */
function webServiceCall(webService, params) {
    var resultAPI = null;
    // get retry number from setting
    var constants = require('~/cartridge/scripts/utils/constants');
    var eventHelpers = require('~/cartridge/scripts/utils/eventHelpers');
    OPLUX_LOGGER.info('[OPLUX] start webServiceCall(), URI: {0}', webService.getURL());

    if (webService) {
        resultAPI = empty(params) ? webService.call() : webService.call(params);

        if (!resultAPI.isOk()) {
            var counter = 1;
            var waitMsec = 500;
            while (counter <= constants.API_RETRY_NUM) {
                OPLUX_LOGGER.debug('[OPLUX] webServiceCall(), retry time: {0}, waitMsec: {1}\n', counter, waitMsec);
                resultAPI = empty(params) ? webService.call() : webService.call(params);
                if (resultAPI.isOk()) {
                    break;
                }
                eventHelpers.sleep(waitMsec);
                waitMsec *= 2;
                counter++;
            }
        }
    }
    OPLUX_LOGGER.info('[OPLUX] webServiceCall(), resultAPI status: {0}, resultAPI: {1}\n', resultAPI.getStatus(), resultAPI.isOk() ? resultAPI.getObject() : resultAPI.getErrorMessage());
    return resultAPI;
}

/**
 * GET the normalized name of the customer
 * @param {string} firstName - First name of the customer
 * @param {string} lastName - Last name of the customer
 * @returns {Object} result - Result of the API call, or null if the call failed
 */
function getNormalizedName(firstName, lastName) {
    try {
        var constants = require('~/cartridge/scripts/utils/constants');
        var helper = require('~/cartridge/scripts/utils/eventHelpers');
        OPLUX_LOGGER.info('[getNormalizedName] START');

        if (firstName && lastName) {
            // Build the API parameter object
            var requestObj = helper.getObjectForApiGetNormalizedName(firstName, lastName);
            if (!requestObj) {
                OPLUX_LOGGER.error('[getNormalizedName] The requestObj is empty.');
                return null;
            }

            // Initialize service URL & parameters
            var params = helper.convertJsonToUrlEncode(requestObj);
            var normalizeNameService = getWebService(constants.OPLUX_NAME_API, 'GET');
            normalizeNameService.setURL(normalizeNameService.getURL() + '?' + params);

            // Call API
            var resultAPI = webServiceCall(normalizeNameService);
            OPLUX_LOGGER.info('[getNormalizedName] END');
            return resultAPI;
        }
        OPLUX_LOGGER.error('[getNormalizedName] The input lastName and/or firstName is empty.');
    } catch (ex) {
        OPLUX_LOGGER.error('[getNormalizedName] Error:  {0}', ex.message);
    }

    return null;
}

/**
 * POST to register the oplux event
 * @param {Object} basket - dw.order.Basket, Order data for registering event.
 * @param {string} normalizedNames - Normalized names.
 * @param {Object} extraRaw - Additional data refer to document.
 * @returns {Object} result - dw.svc.Result, Result of the API call, or null if the call failed
 */
function registerEvent(basket, normalizedNames, extraRaw) {
    try {
        var constants = require('~/cartridge/scripts/utils/constants');
        var helper = require('~/cartridge/scripts/utils/eventHelpers');
        OPLUX_LOGGER.info('[OPLUX] registerEvent() START');

        if (!basket) throw Error('[OPLUX][registerEvent] Order data is empty.');

        // Build the API parameter object
        var requestObj = helper.getObjectForApiRegisterEvent(basket, normalizedNames, extraRaw);
        if (empty(requestObj)) {
            OPLUX_LOGGER.error('[OPLUX][registerEvent] The requestObj is empty.');
            return null;
        }
        OPLUX_LOGGER.info('[OPLUX][registerEvent] requestObj: {0}', JSON.stringify(requestObj));

        // Initialize service URL & parameters
        var params = JSON.stringify(requestObj);
        var eventService = getWebService(constants.OPLUX_EVENT_API_V3, 'POST');

        // Call the API
        var resultAPI = webServiceCall(eventService, params);

        OPLUX_LOGGER.info('[OPLUX] registerEvent() END');
        return resultAPI;
    } catch (ex) {
        OPLUX_LOGGER.error('[OPLUX] Error in registerEvent(): ' + ex);
        return null;
    }
}

/**
 * GET an existing fraud check event
 * @param {string} eventId - ID of the event we want to retrieve
 * @returns {Object} result - dw.svc.Result, Result of the API call, or null if the call failed
 */
function getEventInfo(eventId) {
    try {
        OPLUX_LOGGER.info('[getEventInfo] get event detail START - eventId: {0}', eventId);
        var constants = require('~/cartridge/scripts/utils/constants');
        var helper = require('~/cartridge/scripts/utils/eventHelpers');

        if (eventId) {
            // Build the API parameter object
            var requestObj = helper.getObjectForApiGetEvent(eventId);
            if (!requestObj) {
                OPLUX_LOGGER.error('[getEventInfo] The requestObj is empty.');
                return null;
            }

            // Initialize service URL & parameters
            var params = helper.convertJsonToUrlEncode(requestObj);
            var eventService = getWebService(constants.OPLUX_EVENT_API_V2, 'GET');
            eventService.setURL(eventService.configuration.credential.URL + '?' + params);

            // Call the API
            var resultAPI = webServiceCall(eventService);
            OPLUX_LOGGER.info('[getEventInfo] get event detail END - eventId: {0}', eventId);
            return resultAPI;
        }
        OPLUX_LOGGER.error('[getEventInfo] The input eventId is empty.');
    } catch (ex) {
        OPLUX_LOGGER.error('[getEventInfo] Error: {0}' + ex.message);
    }

    return null;
}

/**
 * UPDATE an existing fraud check event
 * @param {string} eventId - ID of the event we want to update
 * @param {Object} extraRaw - Object contain data to update
 * @returns {Object} result - Object, Result of the API call, or null if the call failed
 */
function updateEventInfo(eventId, extraRaw) {
    try {
        OPLUX_LOGGER.info('[updateEventInfo] update event status START - eventId: {0}', eventId);
        var constants = require('~/cartridge/scripts/utils/constants');
        var helper = require('~/cartridge/scripts/utils/eventHelpers');

        if (!empty(eventId)) {
            // Build the API parameter object
            var requestObj = helper.getObjectForApiUpdateEvent(eventId, extraRaw);

            if (!requestObj) {
                OPLUX_LOGGER.error('[updateEventInfo] The requestObj is empty.');
                return null;
            }

            // Initialize service URL & parameters
            var params = helper.convertJsonToUrlEncode(requestObj);
            var eventService = getWebService(constants.OPLUX_EVENT_API_V2, 'PUT');

            var resultAPI = webServiceCall(eventService, params);
            OPLUX_LOGGER.info('[updateEventInfo] update event status END - eventId: {0}', eventId);
            return resultAPI;
        }
        OPLUX_LOGGER.error('[updateEventInfo] eventId is empty');
    } catch (ex) {
        OPLUX_LOGGER.error('[updateEventInfo] Error: {0}', ex.message);
    }

    return null;
}

module.exports = {
    registerEvent: registerEvent,
    getEventInfo: getEventInfo,
    updateEventInfo: updateEventInfo,
    getNormalizedName: getNormalizedName
};
