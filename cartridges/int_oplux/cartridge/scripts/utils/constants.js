var MessageDigest = require('dw/crypto/MessageDigest');

var Site = require('dw/system/Site');

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
exports.SIGNATURE_HASH_METHOD = MessageDigest.DIGEST_SHA_256;
exports.ENCODING = 'UTF-8';
exports.OPLUX_NAME_API = 'oplux_name_services';
exports.OPLUX_EVENT_API_V2 = 'oplux_event_services_v2';
exports.OPLUX_EVENT_API_V3 = 'oplux_event_services_v3';
exports.API_SECRET_KEY = Site.current.preferences.custom.oplux_secret_access_id ? Site.current.preferences.custom.oplux_secret_access_id : null;
exports.API_SHOP_ID = Site.current.preferences.custom.oplux_shop_id ? Site.current.preferences.custom.oplux_shop_id : null;
exports.API_CONNECTION_ID = Site.current.preferences.custom.oplux_application_id ? Site.current.preferences.custom.oplux_application_id : null;
exports.API_RETRY_NUM = 0;
exports.GET_DEVICE_INFO_URL = Site.current.preferences.custom.oplux_get_device_info_url ? Site.current.preferences.custom.oplux_get_device_info_url : null;
exports.ORDER_STATUS_FOR_REVIEW = Site.current.preferences.custom.oplux_order_status_for_review_hold ? Site.current.preferences.custom.oplux_order_status_for_review_hold : 'HOLD';
exports.ORDER_STATUS_FOR_ERROR = Site.current.preferences.custom.oplux_order_status_for_api_error_limit ? Site.current.preferences.custom.oplux_order_status_for_api_error_limit : 'OK';
exports.RUN_BACKGROUND_JOB = Site.current.preferences.custom.oplux_run_background_job ? Site.current.preferences.custom.oplux_run_background_job : false;
exports.REQUEST_VERSION = '3.0';
exports.MAX_SESSION_STRING_LENGTH = 2000;
