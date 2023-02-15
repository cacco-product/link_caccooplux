/* eslint-disable require-jsdoc */
'use strict';

var OPLUX_LOGGER = require('dw/system/Logger').getLogger('OPLUX', 'O-PLUX');

/**
 * Convert to Json Object to URL Encode
 * @param {Object} obj
 * @param {string} parentKey - key of parent object. it can be null.
 * @returns {string} query
 */
function convertJsonToUrlEncode(obj, parentKey) {
    var queries = [];
    var prefix = !parentKey ? '' : parentKey + '.';
    for (var key in obj) {
        if (!obj[key]) {
            continue;
        }
        var valueType = typeof (obj[key]);
        switch (valueType) {
            case 'string':
                queries.push(prefix + key + '=' + encodeURIComponent(obj[key]));
                break;
            case 'number':
                queries.push(prefix + key + '=' + obj[key]);
                break;
            case 'object': // for nested data.
                var nested = convertJsonToUrlEncode(obj[key], prefix + key);
                if (!empty(nested)) {
                    queries.push(nested);
                }
                break;
        }
    }
    var query = queries.join('&');
    return query;
}

/**
 * Merge Json Objects without function.
 * @param {Object} dst - json object. src is merged to dst.
 * @param {Object} src - json object. src is merged to dst.
 * @returns {Object} dst
 */
function merge(dst, src) {
    if (!src) {
        return dst;
    }
    dst = dst || {};
    for (var key in src) {
        if (typeof (src[key]) === 'object' && !Array.isArray(src[key])) {
            dst[key] = merge(dst[key] || {}, src[key]);
        }
        else {
            dst[key] = src[key];
        }
    }
    return dst;
}

/**
 * @param {string} payload
 * @param {string} algorithm
 * @param {string} encoding
 * @returns {string}
 */
function stringEncoding(payload, algorithm, encoding) {
    var Bytes = require('dw/util/Bytes');
    var Encoding = require('dw/crypto/Encoding');
    var MessageDigest = require('dw/crypto/MessageDigest');

    var digester = new MessageDigest(algorithm);
    return Encoding.toHex(digester.digestBytes(new Bytes(payload, encoding))).toUpperCase();
}

/**
 * Return hashed string.
 * @param {string} src
 * @returns {string}
 */
function hashString(src) {
    var constants = require('~/cartridge/scripts/utils/constants');
    if (!constants.API_SECRET_KEY || !src) {
        return src;
    }

    var hashed = stringEncoding(src, constants.SIGNATURE_HASH_METHOD, constants.ENCODING);
    return hashed;
}
/**
 * Return hashed string.
 * @param {string} algorithm
 * @param {string} encoding
 * @param {string} connectionId
 * @param {string} shopId
 * @param {datetime} dateTime
 * @param {string} secretKey
 * @returns {string}
 */
function buildSignature(algorithm, encoding, connectionId, shopId, dateTime, secretKey) {
    var signature = '';
    try {
        var payload = connectionId + shopId + dateTime + secretKey;
        signature = stringEncoding(payload, algorithm, encoding);
        if (empty(signature)) {
            OPLUX_LOGGER.error('[OPLUX] Error in buildSignature() function when creating the api signature parameter : signature is empty');
        }
    } catch (ex) {
        OPLUX_LOGGER.error('[OPLUX] Exception caught in buildSignature() function: {0}', ex.message);
    }
    return signature;
}

/**
 * Return common object for event API Version2
 * @returns {Object} eventObj
 */
function getCommonObjectForV2() {
    var Calendar = require('dw/util/Calendar');
    var StringUtils = require('dw/util/StringUtils');
    var constants = require('~/cartridge/scripts/utils/constants');
    var currentCalendar = Calendar(new Date());

    currentCalendar.setTimeZone('Asia/Tokyo');
    var apiRequestDateTime = StringUtils.formatCalendar(currentCalendar, 'YYYY/MM/dd HH:mm:ss');
    var apiSignature = buildSignature(constants.SIGNATURE_HASH_METHOD, constants.ENCODING, constants.API_CONNECTION_ID, constants.API_SHOP_ID, apiRequestDateTime, constants.API_SECRET_KEY);

    var eventObj = {
        // APIリクエスト情報
        'request.version': '1.0', // 固定値："1.0"[REQUIRED]
        'request.shop_id': constants.API_SHOP_ID, // O-PLUXで利用する加盟店様のID。運用開始前にご連絡いたします。[REQUIRED]
        'request.signiture': apiSignature, // シグネチャ生成ロジックについては、「実装共通仕様」に記載[REQUIRED]
        'request.hash_method': constants.SIGNATURE_HASH_METHOD.replace('-', ''), // 認証用のシグネチャ生成時に使用したハッシュ関数"SHA1","SHA256"のいずれか[REQUIRED]
        'request.request_datetime': apiRequestDateTime // "YYYY/MM/DD HH24:MI:SS"。※日付と時刻の間に半角スペース有り。 Requestを実行したクライアント側の時刻。[REQUIRED]
    };
    return eventObj;
}

/**
 * Return common object for event API Version3
 * @returns {Object} eventObj
 */
function getCommonObjectForV3() {
    var Calendar = require('dw/util/Calendar');
    var StringUtils = require('dw/util/StringUtils');
    var constants = require('~/cartridge/scripts/utils/constants');
    var currentCalendar = Calendar(new Date());

    currentCalendar.setTimeZone('Asia/Tokyo');
    var apiRequestDateTime = StringUtils.formatCalendar(currentCalendar, 'YYYY/MM/dd HH:mm:ss');
    var apiSignature = buildSignature(constants.SIGNATURE_HASH_METHOD, constants.ENCODING, constants.API_CONNECTION_ID, constants.API_SHOP_ID, apiRequestDateTime, constants.API_SECRET_KEY);

    var eventObj = {
        info: {
            // APIリクエスト情報
            'version': constants.REQUEST_VERSION, // 固定値："3.0"[REQUIRED]
            'shop_id': constants.API_SHOP_ID, // O-PLUXで利用する加盟店様のID。運用開始前にご連絡いたします。[REQUIRED]
            'signature': apiSignature, // シグネチャ生成ロジックについては、「実装共通仕様」に記載[REQUIRED]
            'hash_method': constants.SIGNATURE_HASH_METHOD.replace('-', ''), // 認証用のシグネチャ生成時に使用したハッシュ関数"SHA1","SHA256"のいずれか[REQUIRED]
            'request_datetime': apiRequestDateTime // "YYYY/MM/DD HH24:MI:SS"。※日付と時刻の間に半角スペース有り。 Requestを実行したクライアント側の時刻。[REQUIRED]
        }
    };
    return eventObj;
}

/**
 * Check if the billing and delivery addresses are different
 * @param {Object} order
 * @returns {boolean}
 */
function buyerAndRecipientAreTheSame(order) {
    if (!order.getCustomer().isRegistered()) {
        return false;
    }

    var buyerFirstName = order.billingAddress.firstName;
    var buyerLastName = order.billingAddress.lastName;
    var recipientFirstName = order.defaultShipment.shippingAddress.firstName;
    var recipientLastName = order.defaultShipment.shippingAddress.lastName;
    if (buyerFirstName !== recipientFirstName || buyerLastName !== recipientLastName) {
        return false;
    }

    var buyerPhoneNo = order.billingAddress.phone.replace(/-/g, '');
    var recipientPhoneNo = order.defaultShipment.shippingAddress.phone.replace(/-/g, '');
    if (buyerPhoneNo !== recipientPhoneNo) {
        return false;
    }

    var buyerCountry = order.billingAddress.countryCode.value.toUpperCase();
    var buyerPostal = order.billingAddress.postalCode.replace(/-/g, '');
    var buyerStateCode = order.billingAddress.stateCode;
    var buyerAddress = order.billingAddress.city + order.billingAddress.address1 + order.billingAddress.address2;
    var recipientCountry = order.defaultShipment.shippingAddress.countryCode.value.toUpperCase();
    var recipientPostal = order.defaultShipment.shippingAddress.postalCode.replace(/-/g, '');
    var recipientStateCode = order.defaultShipment.shippingAddress.stateCode;
    var recipientAddress = order.defaultShipment.shippingAddress.city + order.defaultShipment.shippingAddress.address1 + order.defaultShipment.shippingAddress.address2;
    if (buyerCountry !== recipientCountry || buyerPostal !== recipientPostal ||
        buyerStateCode !== recipientStateCode || buyerAddress !== recipientAddress) {
        return false;
    }

    return true;
}

/**
 * Return Object data for NormalizedName API
 * @param {String} firstName - First name of the customer
 * @param {String} lastName - Last name of the customer
 * @returns {Object} requestObj
 */
function getObjectForApiGetNormalizedName(firstName, lastName) {
    var hashedName = lastName.concat(' ', firstName).toUpperCase();
    var requestObj = {
        name: hashedName, // Hashed name info
        fields: 'firstName,lastName' // Fields we want to get in the response
    };
    return requestObj;
}

/**
 * Obtain the birthday from the customer information in the order information.
 * @param {Object} order - dw.order.Order
 * @returns {string} Customer's birthday date yyyy/MM/dd, or a fixed value of '' if there is no input.
 */
function getCustomerBirthday(order) {
    var Calendar = require('dw/util/Calendar');
    var StringUtils = require('dw/util/StringUtils');
    var birthday = order.getCustomer().getProfile().birthday;
    if (order.getCustomer().isRegistered() && birthday) {
        return StringUtils.formatCalendar(new Calendar(birthday), 'yyyy/MM/dd');
    } else {
        return '';
    }
}

/**
 * Obtain the gender from the customer information in the order information.
 * @param {Object} order - dw.order.Order
 * @returns {string} Gender Returns a string, or a fixed value of 3 if there is no input.
 */
function getCustomerGender(order) {
    var constants = require('*/cartridge/scripts/utils/constants');

    if (order.getCustomer().isRegistered() && (order.getCustomer().getProfile().gender.value === constants.GENDER.MALE || order.getCustomer().getProfile().gender.value === constants.GENDER.FEMALE)) {
        return order.getCustomer().getProfile().gender.value.toString();
    } else {
        return constants.GENDER.NEUTRAL;
    }
}

/**
 * Return Object data for RegisterEvent API
 * @param {Object} basketOrOrder - called from Storefront: dw.order.Basket, called from Business Manager:dw.order.Order, Order data for registering event.
 * @param {string} normalizedNames - response of getNormalizedName.
 * @param {Object} extraRaw - Additional request data that is not exist in order or overwriting is needed.
 * @returns {Object} eventObj
 */
function getObjectForApiRegisterEvent(basketOrOrder, normalizedNames, extraRaw) {
    var Calendar = require('dw/util/Calendar');
    var constants = require('*/cartridge/scripts/utils/constants');
    var paymentMethodId;
    if (basketOrOrder.paymentInstruments.empty) {
        // Get payment method from page when calling from Storefront
        var server = require('server');
        var paymentForm = server.forms.getForm('billing');
        paymentMethodId = paymentForm.paymentMethod.htmlValue;
    }
    else {
        // Don't get payment method from page when calling from BM
        paymentMethodId = basketOrOrder.paymentInstruments[0].paymentMethod;
    }
    var paymentMethod = require('dw/order/PaymentMgr').getPaymentMethod(paymentMethodId);

    if (!paymentMethod) {
        throw '[OPLUX] eventHelper. This payment method is not exist.';
    }
    if (!paymentMethod.custom.oplux_model_id || !paymentMethod.custom.oplux_payment_method.value) {
        throw '[OPLUX] eventHelper. This payment method is not assigned with oplux_model_id or oplux_payment_method.';
    }
    var eventObj = getCommonObjectForV3();

    var buyerObj = {};

    var buyerCity = basketOrOrder.billingAddress.city || '';
    var buyerAddress1 = basketOrOrder.billingAddress.address1 || '';
    var buyerAddress2 = basketOrOrder.billingAddress.address2 || '';
    var buyerCompanyName = basketOrOrder.billingAddress.companyName || '';
    var buyerCompanyPost = basketOrOrder.billingAddress.jobTitle || '';
    if (basketOrOrder.billingAddress) {
        buyerObj = {
            hashed_name: {
                first_name_sha2: hashString(basketOrOrder.billingAddress.firstName || ''),
                normalized_first_name_sha2: hashString(normalizedNames && normalizedNames.buyer &&
                    normalizedNames.buyer.firstName && normalizedNames.buyer.firstName.writing) ||
                    hashString(basketOrOrder.billingAddress.firstName || ''),
                last_name_sha2: hashString(basketOrOrder.billingAddress.lastName || ''),
                normalized_last_name_sha2: hashString(normalizedNames && normalizedNames.buyer &&
                    normalizedNames.buyer.lastName && normalizedNames.buyer.lastName.writing) ||
                    hashString(basketOrOrder.billingAddress.lastName || ''),
                nameLength: normalizedNames && normalizedNames.buyer && normalizedNames.buyer.letterCount && normalizedNames.buyer.letterCount.nameLength || '',
                kanjiCountInName: normalizedNames && normalizedNames.buyer && normalizedNames.buyer.letterCount && normalizedNames.buyer.letterCount.kanjiCountInName || '',
                hiraganaCountInName: normalizedNames && normalizedNames.buyer && normalizedNames.buyer.letterCount && normalizedNames.buyer.letterCount.hiraganaCountInName || '',
                katakanaCountInName: normalizedNames && normalizedNames.buyer && normalizedNames.buyer.letterCount && normalizedNames.buyer.letterCount.katakanaCountInName || '',
                alphabetCountInName: normalizedNames && normalizedNames.buyer && normalizedNames.buyer.letterCount && normalizedNames.buyer.letterCount.alphabetCountInName || '',
                otherCountInName: normalizedNames && normalizedNames.buyer && normalizedNames.buyer.letterCount && normalizedNames.buyer.letterCount.otherCountInName || '',
                validName: normalizedNames && normalizedNames.buyer && normalizedNames.buyer.result === 'success' ? '1' : '0'
            },
            address: {
                country: basketOrOrder.billingAddress.countryCode.value.toUpperCase() || '',
                countryName: basketOrOrder.billingAddress.countryCode.displayValue.toUpperCase() || '',
                zipcode: basketOrOrder.billingAddress.postalCode.replace(/-/g, '') || '',
                addressA: basketOrOrder.billingAddress.stateCode || '',
                addressC: buyerCity + buyerAddress1 + buyerAddress2
            },
            tel: {
                fixed_number: basketOrOrder.billingAddress.phone.replace(/-/g, ''), // ハイフンなし
                mobile_number: basketOrOrder.getCustomer().isRegistered() ? basketOrOrder.getCustomer().getProfile().phoneMobile.replace(/-/g, '') : ''
            },
            email: {
                pc: {
                    hashed_account_sha2: hashString(basketOrOrder.customerEmail.substr(0, basketOrOrder.customerEmail.indexOf('@'))),
                    domain: basketOrOrder.customerEmail.substr(basketOrOrder.customerEmail.indexOf('@') + 1)
                }
            }
        };

        var buyerCompany = {};
        if (!empty(buyerCompanyName)) {
            buyerCompany.name = buyerCompanyName;
        }
        if (!empty(buyerCompanyPost)) {
            buyerCompany.post = buyerCompanyPost;
        }
        if (Object.keys(buyerCompany).length !== 0) {
            buyerObj.company = buyerCompany;
        }

        if (basketOrOrder.getCustomer().isRegistered()) {
            buyerObj.ID = basketOrOrder.getCustomerNo();
            buyerObj.birth_day = getCustomerBirthday(basketOrOrder);
            buyerObj.sex = getCustomerGender(basketOrOrder);
        }
    }
    var shipment = basketOrOrder.defaultShipment;
    var deliveryObj = {};
    var deliveryCity = shipment.shippingAddress.city || '';
    var deliveryAddress1 = shipment.shippingAddress.address1 || '';
    var deliveryAddress2 = shipment.shippingAddress.address2 || '';
    var deliveryCompanyName = shipment.shippingAddress.companyName || '';
    var deliveryCompanyPost = shipment.shippingAddress.jobTitle || '';
    if (shipment) {
        deliveryObj = {
            hashed_name: {
                first_name_sha2: hashString(shipment.shippingAddress.firstName || ''),
                normalized_first_name_sha2: hashString(normalizedNames && normalizedNames.delivery && normalizedNames.delivery.firstName && normalizedNames.delivery.firstName.writing) || hashString(shipment.shippingAddress.firstName || ''),
                last_name_sha2: hashString(shipment.shippingAddress.lastName || ''),
                normalized_last_name_sha2: hashString(normalizedNames && normalizedNames.delivery && normalizedNames.delivery.lastName && normalizedNames.delivery.lastName.writing) || hashString(shipment.shippingAddress.lastName || ''),
                nameLength: normalizedNames && normalizedNames.delivery && normalizedNames.delivery.letterCount && normalizedNames.delivery.letterCount.nameLength || '',
                kanjiCountInName: normalizedNames && normalizedNames.delivery && normalizedNames.delivery.letterCount && normalizedNames.delivery.letterCount.kanjiCountInName || '',
                hiraganaCountInName: normalizedNames && normalizedNames.delivery && normalizedNames.delivery.letterCount && normalizedNames.delivery.letterCount.hiraganaCountInName || '',
                katakanaCountInName: normalizedNames && normalizedNames.delivery && normalizedNames.delivery.letterCount && normalizedNames.delivery.letterCount.katakanaCountInName || '',
                alphabetCountInName: normalizedNames && normalizedNames.delivery && normalizedNames.delivery.letterCount && normalizedNames.delivery.letterCount.alphabetCountInName || '',
                otherCountInName: normalizedNames && normalizedNames.delivery && normalizedNames.delivery.letterCount && normalizedNames.delivery.letterCount.otherCountInName || '',
                validName: normalizedNames && normalizedNames.delivery && normalizedNames.delivery.result === 'success' ? '1' : '0'
            },
            address: {
                country: shipment.shippingAddress.countryCode.value.toUpperCase() || '',
                countryName: shipment.shippingAddress.countryCode.displayValue.toUpperCase() || '',
                zipcode: shipment.shippingAddress.postalCode.replace(/-/g, '') || '',
                addressA: shipment.shippingAddress.stateCode || '',
                addressC: deliveryCity + deliveryAddress1 + deliveryAddress2
            },
            tel: {
                fixed_number: shipment.shippingAddress.phone.replace(/-/g, ''), // ハイフンなし
                mobile_number: basketOrOrder.getCustomer().isRegistered() ? basketOrOrder.getCustomer().getProfile().phoneMobile.replace(/-/g, '') : ''
            },
            email: {
                pc: {
                    hashed_account_sha2: hashString(basketOrOrder.customerEmail.substr(0, basketOrOrder.customerEmail.indexOf('@'))),
                    domain: basketOrOrder.customerEmail.substr(basketOrOrder.customerEmail.indexOf('@') + 1)
                }
            }
        };

        var deliveryCompany = {};
        if (!empty(deliveryCompanyName)) {
            deliveryCompany.name = deliveryCompanyName;
        }
        if (!empty(deliveryCompanyPost)) {
            deliveryCompany.post = deliveryCompanyPost;
        }
        if (Object.keys(deliveryCompany).length !== 0) {
            deliveryObj.company = deliveryCompany;
        }

        if (buyerAndRecipientAreTheSame(basketOrOrder)) {
            deliveryObj.ID = basketOrOrder.getCustomerNo();
            deliveryObj.birth_day = getCustomerBirthday(basketOrOrder);
            deliveryObj.sex = getCustomerGender(basketOrOrder);
        }
    }

    var basketUUID = basketOrOrder.getUUID();
    var cardNumber = session.getPrivacy().cardNumber;
    var creationDate = new Calendar(basketOrOrder.creationDate);
    creationDate.setTimeZone('Asia/Tokyo');
    var eventRequestObj = {
        telegram: {
            event: {
                model_id: paymentMethod.custom.oplux_model_id, // 審査に使用するモデル。運用開始前にご連絡いたします。例："CRD_01","ATB_01"等[REQUIRED]
                event_id_for_shop: basketUUID || '', // 加盟店様で1審査当たりユニークとなる管理ID。受注ID等。[REQUIRED]
                event_type: 'EC', // 固定。[REQUIRED]
                ec: {
                    media_code: 'Web購入',
                    settle: {
                        limit_price: '999999', // 一購入者の上限金額をセット。特に定めがない場合は「999999」をセット[REQUIRED]
                        status: constants.EVENT_REQUEST_SETTLE_DEFAULT_STATUS.BEFORE_BILLING, // 決済ステータス。以下コードから、初期の決済ステータスを指定。00:請求前 60:チャージバック 99:キャンセル 100:送付後キャンセル※通常、イベント登録時は"00"をセット[REQUIRED]
                        datetime: eventObj.info.request_datetime, // "YYYY/MM/DD HH24:MI:SS" ※日付と時刻の間に半角スペース有り保持していない場合は、申請日時（request.request_datetime）をセット[REQUIRED]
                        amount: basketOrOrder.totalGrossPrice.value.toString(), // 顧客へ請求する最終的な金額（送料、手数や割引等含む）0円可[REQUIRED]
                        method: paymentMethod.custom.oplux_payment_method.value, // 01:後払い 02:クレジットカード決済 03:代金引換 04:前払い 05:電子マネー 06:ポイント支払 07:口座振替 08:分割払い 09:Payeasy10:PayPal 99:その他,[REQUIRED]
                        credit_card: {}
                    },
                    customers: {
                        buyer: buyerObj,
                        deliveries: [deliveryObj]
                    },
                    items: []
                }
            }
        }
    };

    for (var key in shipment.productLineItems) {
        var item = shipment.productLineItems[key];
        eventRequestObj.telegram.event.ec.items.push({
            "shop_item_id": item.productID,
            "item_price": item.priceValue,
            "item_quantity": item.quantity.value,
            "item_name": item.productName,
            "item_category": item.product.classificationCategory ? item.product.classificationCategory.displayName.substr(0, 20) : '' // 文字数の上限が20文字。
        });
    }

    if (!empty(cardNumber)) {
        eventRequestObj.telegram.event.ec.settle.credit_card = {
            bincode: cardNumber.substr(0, 6)
        };
    }
    eventObj = merge(eventObj, eventRequestObj);
    if (extraRaw) {
        eventObj = merge(eventObj, extraRaw);
    }

    return eventObj;
}

/**
 * Return object data for get event info API
 * @param {string} eventId - registed event id
 * @returns {Object} eventObj
 */
function getObjectForApiGetEvent(eventId) {
    var eventObj = getCommonObjectForV2();
    eventObj['request.fields'] = 'rules,score,similars,aaresult,maresult'; // 指定した値の情報をレスポンスに追加。「rules」「score」「similars」「aaresult」「maresult」を指定可能。複数指定の場合は半角カンマで連結して指定可能。※本APIの用途に応じて必ず値を設定いただくようお願いいたします。
    eventObj['request.condition.event_id'] = eventId; // イベント登録時にO-PLUXで返却するID本IDを指定して取得してください
    return eventObj;
}

/**
 * Return object data for update event info API
 * @param {string} eventId - registed event id
 * @param {Object} paramsObj
 * @param {string} paramsObj.settleStatus - new settleStatus to update event info
 * @param {string} paramsObj.updateStatus - new status to update event info
 * @param {string} paramsObj.memo - reason why update event info
 * @param {boolean} paramsObj.deleted - delete event after update event info or not
 * @param {string} paramsObj.updateBlacked - add customer to blacklist
 * @param {string} paramsObj.black_settle_category - payment method this customer used
 * @param {string} paramsObj.black_customer_type - this customer is buyer or receiver
 * @param {string} paramsObj.black_other_category - other reason
 * @returns {Object} eventObj
 */
function getObjectForApiUpdateEvent(eventId, paramsObj) {
    var eventObj = getCommonObjectForV2();
    var requestObj = {
        condition: {
            event_id: eventId // イベント登録時にO-PLUXで返却するID本IDを指定して取得してください
        },
        update: { // OPTIONAL
            settle_status: paramsObj && paramsObj.settleStatus || null, // 決済ステータス。00:請求前 10:請求中 20:支払済 30:期限超過 40:委託済 50:貸倒 60:チャージバック 99:キャンセル 100:送付後キャンセル
            maResult: paramsObj && paramsObj.updateStatus || null, // 更新後の値をセット 10:OK,20:NG,30:HOLD
            memo: paramsObj && paramsObj.memo || null, // 更新後の値をセット
            deleted: paramsObj && paramsObj.deleted ? '1' : '0', // イベントデータを論理削除する場合に1をセット。論理削除を取り消す場合に0をセット。 ※論理削除されたイベントはマッチング対象外となります
            blacked: paramsObj && paramsObj.blacked || null, // ブラックとして登録する場合に1をセット。 既に登録済みのブラックを取り消す場合 には0をセット。
            black_customer_type: paramsObj && paramsObj.black_customer_type || null, // ブラック登録対象となるカスタマコード
            black_settle_category: paramsObj && paramsObj.black_settle_category || null, // ブラックの決済カテゴリ。ブラックとして登録する注文の決済のカテゴリ
            black_other_category: paramsObj && paramsObj.black_other_category || null // その他ブラックカテゴリ。決済以外の観点でのブラック登録の場合にセット。
        }
    };
    eventObj.request = merge(eventObj.request, requestObj);
    return eventObj;
}
/**
 * @param {string} str
 * @returns {Object} jsonObj
 */
function parseToJson(str) {
    var jsonObj;
    try {
        OPLUX_LOGGER.debug('Parse to JSON Object START');
        jsonObj = JSON.parse(str);
    } catch (e) {
        OPLUX_LOGGER.error('parse to json error: {0}', e.message);
    }

    OPLUX_LOGGER.debug('Parse to JSON Object END');
    return jsonObj;
}

/**
 * @param {string} str
 * @returns {object} xmlObj
 */
function parseToXML(str) {
    var xmlObj;
    try {
        OPLUX_LOGGER.debug('Parse to XML Object START');
        var Reader = require('dw/io/Reader');
        var responseReader = new Reader(str);
        var XMLStreamReader = require('dw/io/XMLStreamReader');
        var xmlStreamReader = new XMLStreamReader(responseReader);
        var XMLStreamConstants = require('dw/io/XMLStreamConstants');
        if (xmlStreamReader.hasNext() && xmlStreamReader.next() === XMLStreamConstants.START_ELEMENT) {
            xmlObj = xmlStreamReader.readXMLObject();
        }
        xmlStreamReader.close();
        responseReader.close();
    } catch (e) {
        OPLUX_LOGGER.error('parse to xml error: {0}', e.message);
    }

    OPLUX_LOGGER.debug('Parse to XML Object END');
    return xmlObj;
}

/**
 * @param {String} serviceName
 * @param {String} method
 * @returns {Object}
 */
function getMockDataForServices(serviceName, method) {
    var constants = require('~/cartridge/scripts/utils/constants');
    var mockData;
    if (serviceName === constants.OPLUX_NAME_API) {
        mockData = {
            statusCode: 200,
            statusMessage: 'OK',
            text: JSON.stringify({
                response: {
                    firstName: {
                        alphabet: null,
                        reading: null,
                        writing: '太郎 '
                    },
                    lastName: {
                        alphabet: null,
                        existed: true,
                        reading: null,
                        writing: 'モックテスト'
                    },
                    result: 'success', // success or error
                    letterCount: {
                        alphabetCountInName: 0,
                        hiraganaCountInName: 0,
                        kanjiCountInName: 2,
                        katakanaCountInName: 0,
                        nameLength: 8,
                        otherCountInName: 0
                    },
                    time: 42 // response in ms
                }
            })
        };
    } else {
        switch (method) {
            case 'GET':
                mockData = {
                    statusCode: 200,
                    statusMessage: 'OK',
                    text: '<response>' +
                        '<time>3059</time>' +
                        '<result>10</result>' +
                        '<errors/>' +
                        '<events>' +
                        '<event>' +
                        '<id>121102030247458037051F3D04342D7BF8D13D985CD46E6</id>' +
                        '<request_datetime>2012/11/02 11:59:41</request_datetime>' +
                        '<event_type>EC</event_type>' +
                        '<authori_deadline_datetime>2012/11/02 13:59:41</authori_deadline_datetime>' +
                        '<aaresult>' +
                        '<result>HOLD</result>' +
                        '</aaresult>' +
                        '<maresult>' +
                        '<reason></reason>' +
                        '</maresult>' +
                        '<score>' +
                        '<ok>0</ok>' +
                        '<ng>20000</ng>' +
                        '<hold>20500</hold>' +
                        '</score>' +
                        '<rules>' +
                        '<rule>' +
                        '<code>BLK_COK</code>' +
                        '<ok>0</ok>' +
                        '<ng>10000</ng>' +
                        '<hold>0</hold>' +
                        '<touchpoint>event.cookie</touchpoint>' +
                        '<fired>true</fired>' +
                        '</rule>' +
                        '<rule>' +
                        '<code>NEG_ITEM</code>' +
                        '<ok>0</ok>' +
                        '<ng>0</ng>' +
                        '<hold>10000</hold>' +
                        '<touchpoint>event.ec.customers.delivery.shipping.item.item_name</touchpoint>' +
                        '<fired>true</fired>' +
                        '</rule>' +
                        '</rules>' +
                        '<similars>' +
                        '<event_id>12102402471576345E9293C244E4E809E43E49D2E0C675D</event_id>' +
                        '<rule_code></rule_code>' +
                        '<touchpoints></touchpoints>' +
                        '</similars>' +
                        '</event>' +
                        '</events>' +
                        '</response>'
                };
                break;
            case 'PUT':
                mockData = {
                    statusCode: 200,
                    statusMessage: 'OK',
                    text: '<response>' +
                        '<time>17</time>' +
                        '<result>10</result>' +
                        '<errors/>' +
                        '<id>17022018534007809833EA7A236414B91EB0DDABEA41D76</id>' +
                        '</response>'
                };
                break;
            case 'POST':
                mockData = {
                    statusCode: 200,
                    statusMessage: 'OK',
                    text: '<response>' +
                        '<time>4007</time>' +
                        '<result>20</result>' +
                        '<errors/>' +
                        '<event>' +
                        '<id>140611022211204FBEA7CF83A494A7288D02D98AE30F9B3</id>' +
                        '<result>NG</result>' +
                        '<skipped>0</skipped>' +
                        '<score>' +
                        '<ok>0</ok>' +
                        '<ng>0</ng>' +
                        '<hold>48500</hold>' +
                        '</score>' +
                        '<rules>' +
                        '<rule>' +
                        '<code>NEG_ITEM</code>' +
                        '<ok>0</ok>' +
                        '<ng>0</ng>' +
                        '<hold>10000</hold>' +
                        '<touchpoint>event.ec.customers.delivery.shipping.item.item_name</touchpoint>' +
                        '<description>決済金額が閾値以上、かつ、購入商品名にネガティブワードが含まれる場合に発動。 </description>' +
                        '</rule>' +
                        '<rule>' +
                        '<code>PAID_MOBMAIL</code>' +
                        '<ok>0</ok>' +
                        '<ng>0</ng>' +
                        '<hold>500</hold>' +
                        '<touchpoint>event.ec.customers.buyer.email.mobile.domain,event.ec.customers.buyer.email.mobile.hashed_account</touchpoint>' +
                        '<description>支払い済みの過去イベントを、携帯電話メールアドレスをキーとして検索し、一致件数が閾値以上の場合に発動。 </description>' +
                        '</rule>' +
                        '</rules>' +
                        '<similars>' +
                        '<similar>' +
                        '<event_id>140407030052358A191F21F4CC04346BBF0FE27DA41801B</event_id>' +
                        '<rule_code></rule_code>' +
                        '<touchpoints></touchpoints>' +
                        '</similar>' +
                        '<similar>' +
                        '<event_id>1208270637569454CEB14A400F649B080FF5793E5DE35BC</event_id>' +
                        '<rule_code></rule_code>' +
                        '<touchpoints></touchpoints>' +
                        '</similar>' +
                        '</similars>' +
                        '</event>' +
                        '</response>'
                };
                break;
            default:
                mockData = {
                    statusCode: 200,
                    statusMessage: 'OK',
                    text: '<response>' +
                        '<time>3059</time>' +
                        '<result>10</result>' +
                        '<errors/>' +
                        '<events>' +
                        '<event>' +
                        '<id>121102030247458037051F3D04342D7BF8D13D985CD46E6</id>' +
                        '<request_datetime>2012/11/02 11:59:41</request_datetime>' +
                        '<event_type>EC</event_type>' +
                        '<authori_deadline_datetime>2012/11/02 13:59:41</authori_deadline_datetime>' +
                        '<aaresult>' +
                        '<result>HOLD</result>' +
                        '</aaresult>' +
                        '<maresult>' +
                        '<reason></reason>' +
                        '</maresult>' +
                        '<score>' +
                        '<ok>0</ok>' +
                        '<ng>20000</ng>' +
                        '<hold>20500</hold>' +
                        '</score>' +
                        '<rules>' +
                        '<rule>' +
                        '<code>BLK_COK</code>' +
                        '<ok>0</ok>' +
                        '<ng>10000</ng>' +
                        '<hold>0</hold>' +
                        '<touchpoint>event.cookie</touchpoint>' +
                        '<fired>true</fired>' +
                        '</rule>' +
                        '<rule>' +
                        '<code>NEG_ITEM</code>' +
                        '<ok>0</ok>' +
                        '<ng>0</ng>' +
                        '<hold>10000</hold>' +
                        '<touchpoint>event.ec.customers.delivery.shipping.item.item_name</touchpoint>' +
                        '<fired>true</fired>' +
                        '</rule>' +
                        '</rules>' +
                        '<similars>' +
                        '<event_id>12102402471576345E9293C244E4E809E43E49D2E0C675D</event_id>' +
                        '<rule_code></rule_code>' +
                        '<touchpoints></touchpoints>' +
                        '</similars>' +
                        '</event>' +
                        '</events>' +
                        '</response>'
                };
        }
    }
    return mockData;
}
/**
 * @param {datetime} waitMsec
 * @returns {undefined}
 */
function sleep(waitMsec) {
    var startMsec = new Date();

    // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
    while (new Date() - startMsec < waitMsec);
}

/**
 * @param {Object} basketOrOrder
 * @param {Object} opluxResult
 * @param {Object} extraRaw
 * @returns {Object}
 */
function eventRegistrationResultHandler(basketOrOrder, opluxResult, extraRaw) {
    if (basketOrOrder === null || opluxResult === null) {
        OPLUX_LOGGER.error('[eventHelper] eventRegistrationResultHandler() order or opluxResult is null');
        return null;
    }

    var Transaction = require('dw/system/Transaction');
    var Calendar = require('dw/util/Calendar');
    var StringUtils = require('dw/util/StringUtils');
    var constants = require('~/cartridge/scripts/utils/constants');
    var currentCalendar = Calendar(new Date());
    currentCalendar.setTimeZone('Asia/Tokyo');
    var currentDate = StringUtils.formatCalendar(currentCalendar, 'YYYY/MM/dd HH:mm:ss');
    var eventId;
    var aaResult;
    var ruleCode = '';
    var ruleDesc = '';
    var ruleGroup;
    var errorMsg = '';
    var resObj;
    var responseResult = constants.RESPONSE_RESULT.ERROR;
    var deviceInfo = extraRaw.telegram.event.device_info;
    var paymentMethodId;
    if (basketOrOrder.paymentInstruments.empty) {
        // Get payment method from page when calling from Storefront
        var server = require('server');
        var paymentForm = server.forms.getForm('billing');
        paymentMethodId = paymentForm.paymentMethod.htmlValue;
    }
    else {
        // Don't get payment method from page when calling from BM
        paymentMethodId = basketOrOrder.paymentInstruments[0].paymentMethod;
    }
    try {
        if (opluxResult.isOk()) {
            var data = opluxResult.getObject();
            responseResult = data.result.toString();

            if (responseResult === constants.RESPONSE_RESULT.OK) { // success
                OPLUX_LOGGER.debug('[eventHelper] eventRegistrationResultHandler() eventid: {0}, aaResult: {1}', data.telegram.event.id.toString(), data.telegram.event.aaresult.result.toString());
                eventId = data.telegram.event.id.toString();
                aaResult = data.telegram.event.aaresult.result.toString();
                var rules = data.telegram.event.rules;

                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i];
                    ruleCode += rule.code;
                    ruleCode += i !== rules.length - 1 ? '／' : '';
                    ruleDesc += rule.description;
                    ruleDesc += i !== rules.length - 1 ? '／' : '';
                }
                ruleGroup = data.telegram.event.rule_group.toString();
            } else { // unsucess
                var errors = data.errors;
                errorMsg = createOpluxEventRegistrationErrorMessage(currentDate, errors);
                OPLUX_LOGGER.debug('[eventHelper] eventRegistrationResultHandler() error message: {0}', errorMsg);
            }

            // update oplux status to order object
            Transaction.wrap(function () {
                basketOrOrder.custom.oplux_response_result = responseResult;
                basketOrOrder.custom.oplux_event_id = eventId || '';
                basketOrOrder.custom.oplux_event_aa_result = aaResult || '';
                basketOrOrder.custom.oplux_rule_code = ruleCode || '';
                basketOrOrder.custom.oplux_rule_description = ruleDesc || '';
                basketOrOrder.custom.oplux_rule_group = ruleGroup || '';
                basketOrOrder.custom.oplux_settle_status = constants.EVENT_REQUEST_SETTLE_DEFAULT_STATUS.BEFORE_BILLING;
                basketOrOrder.custom.oplux_blacked_flag = false;
                basketOrOrder.custom.oplux_error = errorMsg || '';
                basketOrOrder.custom.oplux_device_info = deviceInfo || '';
                var opluxEventApiResponsResults = {
                    responseResult: responseResult,
                    eventId: eventId || '',
                    aaResult: aaResult || '',
                    ruleCode: ruleCode || '',
                    ruleDesc: ruleDesc || '',
                    ruleGroup: ruleGroup || '',
                    settleStatus: constants.EVENT_REQUEST_SETTLE_DEFAULT_STATUS.BEFORE_BILLING,
                    blackedFlag: false,
                    errorMsg: errorMsg || '',
                    deviceInfo: deviceInfo || ''
                };

                basketOrOrder.custom.oplux_event_api_response_json = createOpluxEventApiResponseJson(
                    basketOrOrder.custom.oplux_event_api_response_json,
                    opluxResult.isOk(),
                    opluxEventApiResponsResults,
                    paymentMethodId
                );
            });
        } else {
            var apiResultErrorMessage = opluxResult.getErrorMessage();
            var errors = apiResultErrorMessage.errors;
            errorMsg = createOpluxEventRegistrationErrorMessage(currentDate, errors);
            if (!errorMsg) {
                errorMsg = '[' + currentDate + '] errorCode ' + opluxResult.getError() + ': ' + opluxResult.getMsg();
            }
        }
    } catch (e) {
        OPLUX_LOGGER.error('[eventHelper] eventRegistrationResultHandler error: {0}', e.message);
        errorMsg = '[' + currentDate + '] ' + e.message;
        Transaction.wrap(function () {
            basketOrOrder.custom.oplux_response_result = constants.RESPONSE_RESULT.ERROR;
            basketOrOrder.custom.oplux_error = errorMsg;
            basketOrOrder.custom.oplux_device_info = deviceInfo || '';
        });
    }

    if (!errorMsg) {
        resObj = {
            success: true,
            eventId: eventId,
            responseResult: responseResult,
            aaResult: aaResult,
            ruleCode: ruleCode,
            ruleDesc: ruleDesc,
            ruleGroup: ruleGroup
        };
    } else {
        resObj = {
            success: false,
            responseResult: responseResult,
            errorMsg: errorMsg
        };
    }

    return resObj;
}

/**
 * Create event registration error message from API response
 * @param {String} currentTimestamp - Current date and time
 * @param {Array} codeAndMessages - Error code and error message obtained from API response
 * @returns {String} A string containing the error message created by this function
 */
function createOpluxEventRegistrationErrorMessage(currentTimestamp, codeAndMessages) {
    if (empty(codeAndMessages)) {
        return null;
    }
    var messages = codeAndMessages.map(function (m) {
        return m.code + '・' + m.message;
    });
    return '[' + currentTimestamp + '] ' + messages.join('／');
}

/**
 * Create JSON to store the response from API
 * @param {Object} apiResponseJson - Object to store JSON
 * @param {boolean} isOkOpluxExaminationResult - API examination results
 * @param {Object} opluxEventApiResponsResults - object that stores the contents of the API response
 * @param {string} paymentMethodId - string that payment method ID from basket or order
 * @returns {Object} JSON object that stores API response for each examination model
 */
function createOpluxEventApiResponseJson(apiResponseJson, isOkOpluxExaminationResult, opluxEventApiResponsResults, paymentMethodId) {
    if (!isOkOpluxExaminationResult) {
        return JSON.stringify({});
    }

    var paymentMethod = require('dw/order/PaymentMgr').getPaymentMethod(paymentMethodId);
    if (!paymentMethod) {
        OPLUX_LOGGER.debug('[createOpluxEventApiResponseJson] paymentMethod is null or undefined');
        return JSON.stringify({});
    }

    var modelIdAndApiResults = empty(apiResponseJson) ? {} : JSON.parse(apiResponseJson);

    // 同一model_idの場合は実行されない
    if (empty(modelIdAndApiResults[paymentMethod.custom.oplux_model_id])) {
        modelIdAndApiResults[paymentMethod.custom.oplux_model_id] = opluxEventApiResponsResults;
    }
    else {
        // オブジェクトが仮にあった場合はイレギュラーのため、WarnのLog出力
        OPLUX_LOGGER.warn('[createOpluxEventApiResponseJson] There is already a examination model with the same name');
    }

    return JSON.stringify(modelIdAndApiResults);
}

/**
 * Update the basket with API examination result JSON
 * @param {Object}  basket - dw.order.Basket, Order data for registering event.
 * @returns {undefined}
 */
function updateBasketOpluxExaminationResult(basket) {
    var Transaction = require('dw/system/Transaction');
    var constants = require('~/cartridge/scripts/utils/constants');
    var paymentMethodId = basket.paymentInstruments.empty ? 'NO_PAYMENT' : basket.paymentInstruments[0].paymentMethod;
    var paymentMethod = require('dw/order/PaymentMgr').getPaymentMethod(paymentMethodId);

    if (!paymentMethod) {
        OPLUX_LOGGER.debug('[updateBasketExaminationResult] paymentMethod is null or undefined');
        return;
    }

    var opluxEventApiResponse = basket.custom.oplux_event_api_response_json ? JSON.parse(basket.custom.oplux_event_api_response_json) : {};
    var opluxModelId = paymentMethod.custom.oplux_model_id;
    var opluxEventResult = opluxEventApiResponse[opluxModelId];

    if (!opluxEventResult) {
        OPLUX_LOGGER.debug('[updateBasketExaminationResult] basket.custom.oplux_event_api_response_json[paymentMethod.custom.oplux_model_id] is null or undefined');
        return;
    }

    Transaction.wrap(function () {
        basket.custom.oplux_event_aa_result = opluxEventResult.aaResult || '';
        basket.custom.oplux_response_result = opluxEventResult.responseResult;
        basket.custom.oplux_event_id = opluxEventResult.eventId || '';
        basket.custom.oplux_rule_code = opluxEventResult.ruleCode || '';
        basket.custom.oplux_rule_description = opluxEventResult.ruleDesc || '';
        basket.custom.oplux_rule_group = opluxEventResult.ruleGroup || '';
        basket.custom.oplux_settle_status = opluxEventResult.settleStatus || constants.EVENT_REQUEST_SETTLE_DEFAULT_STATUS.BEFORE_BILLING;
        basket.custom.oplux_blacked_flag = false;
        basket.custom.oplux_device_info = opluxEventResult.deviceInfo || '';
    });
}

module.exports = {
    sleep: sleep,
    merge: merge,
    parseToXML: parseToXML,
    parseToJson: parseToJson,
    getMockDataForServices: getMockDataForServices,
    convertJsonToUrlEncode: convertJsonToUrlEncode,
    getObjectForApiRegisterEvent: getObjectForApiRegisterEvent,
    getObjectForApiGetEvent: getObjectForApiGetEvent,
    getObjectForApiUpdateEvent: getObjectForApiUpdateEvent,
    getObjectForApiGetNormalizedName: getObjectForApiGetNormalizedName,
    eventRegistrationResultHandler: eventRegistrationResultHandler,
    updateBasketOpluxExaminationResult: updateBasketOpluxExaminationResult
};