'use strict';

/**
 * @module test\mock\int_oplux\cartridge\scripts\utils\constants.js
 */

exports.PAYMENT_METHOD = {
    YAMATO_CVS: '99',
    YAMATO_COD: '03',
    NO_PAYMENT: '99',
    CREDIT_CARD: '02',
    AMAZON_PAYMENTS: '99'
};

exports.EVENT_STATUS = {
    OK: 'OK',
    NG: 'NG',
    HOLD: 'HOLD',
    REVIEW: 'REVIEW',
    FAILED: 'FAILED',
    ERROR: 'ERROR'
};

exports.EVENT_STATUS_CODE = {
    OK: '10',
    NG: '20',
    HOLD: '30',
    REVIEW: '40'
};

exports.BLACK_CUSTOMER_TYPE = {
    REGISTER_NG: '10',
    SHIPPING_ADDRESS_NG: '20',
    BOTH_NG: '30'
};

exports.RESPONSE_RESULT = {
    OK: '10',
    ERROR: '20'
};

exports.GENDER = {
    MALE: '1',
    FEMALE: '2',
    NEUTRAL: '3'
};

exports.EVENT_REQUEST_SETTLE_DEFAULT_STATUS = {
    /** 請求前 */
    BEFORE_BILLING: '00',
    /** 請求中 */
    BILLING: '10',
    /** 支払済 */
    AFTER_BILLING: '20',
    /** 期限超過 */
    PAYMENT_OVERDUE: '30',
    /** 委託済 */
    ENTRUSTED: '40',
    /** 貸倒 */
    BAD_DEBT: '50',
    /** チャージバック */
    CHARGEBACK: '60',
    /** キャンセル */
    CANCEL: '99',
    /** 送付後キャンセル */
    CANCEL_AFTER_SHIPPING: '100'
};

exports.LIMIT_SIZE = 20000;
exports.SIGNATURE_HASH_METHOD = 'DIGEST_SHA_256';
exports.ENCODING = 'UTF-8';
exports.OPLUX_NAME_API = 'oplux_name_services';
exports.OPLUX_EVENT_API_V2 = 'oplux_event_services_v2';
exports.OPLUX_EVENT_API_V3 = 'oplux_event_services_v3';
exports.API_SECRET_KEY = true;
exports.API_SHOP_ID = 'SP00WIREDBEANS';
exports.API_CONNECTION_ID = 'BBBA26B21EF94AE8BCB8D9B77F24A443';
exports.API_RETRY_NUM = 3;
exports.GET_DEVICE_INFO_URL = '//fraud-buster.appspot.com/js/fraudbuster.js';
exports.ORDER_STATUS_FOR_REVIEW = { value: 'HOLD' };
exports.ORDER_STATUS_FOR_ERROR = { value: 'OK' };
exports.RUN_BACKGROUND_JOB = false;
exports.REQUEST_VERSION = '3.0';
