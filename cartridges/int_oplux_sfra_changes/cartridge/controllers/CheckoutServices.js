'use strict';

var server = require('server');
var eventHelpers = require('*/cartridge/scripts/utils/eventHelpers');
var constants = require('*/cartridge/scripts/utils/constants');
server.extend(module.superModule);
var Transaction = require('dw/system/Transaction');
var BasketMgr = require('dw/order/BasketMgr');
var currentBasket = BasketMgr.getCurrentBasket();

server.append(
    'SubmitPayment',
    function (req, res, next) {
        this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
            var deviceInfo = req.httpParameterMap.get('fraudbuster');
            var paymentForm = server.forms.getForm('billing');
            var cardNumber = paymentForm.creditCardFields.cardNumber.value;
            var opluxCallHelpers = require('*/cartridge/scripts/utils/opluxCallHelpers');
            var URLUtils = require('dw/web/URLUtils');
            if (deviceInfo) {
                deviceInfo.getValue().length <= constants.MAX_SESSION_STRING_LENGTH ? req.session.privacyCache.set('opluxDeviceInfo', deviceInfo.getValue()) : req.session.privacyCache.set('opluxDeviceInfo', '');
                req.session.privacyCache.set('cardNumber', cardNumber);
            }

            var paymentMethodID = paymentForm.paymentMethod.htmlValue;
            var paymentMethod = dw.order.PaymentMgr.getPaymentMethod(paymentMethodID);
            var modelIdArray = [];
            // Check if the model ID is saved in the session
            if (session.privacy.model_id) {
                var modelId = session.privacy.model_id;
                modelIdArray = modelId.split(",");
                // Check if the model ID in the session and selected payment method model ID are the same
                if (modelIdArray.indexOf(paymentMethod.custom.oplux_model_id) !== -1) {
                    // Transition to the PlaceOrder page without reexamination
                    return;
                }
                else {
                    modelIdArray.push(paymentMethod.custom.oplux_model_id);
                    session.privacy.model_id = modelIdArray.join(',');
                }
            }
            else {
                session.privacy.model_id = paymentMethod.custom.oplux_model_id;
                // Enter an empty string as oplux_event_api_response_json may not have a value entered and may result in an error during a review error.
                Transaction.wrap(function () {
                    currentBasket.custom.oplux_event_api_response_json = '{}';
                });
            }

            // Save the model ID in the session and reexamine
            if (!opluxCallHelpers.checkOplux(currentBasket).pass) {
                session.privacy.model_id = null;
                res.json({
                    error: true,
                    cartError: true,
                    fieldErrors: [],
                    serverErrors: [],
                    redirectUrl: URLUtils.url('Page-Show', 'cid', 'opluxEventNG').toString()
                });
            }
            return;
        });

        return next();
    }
);

server.prepend(
    'PlaceOrder', 
    function (req, res, next) {
        var BasketMgr = require('dw/order/BasketMgr');
        var currentBasket = BasketMgr.getCurrentBasket();
        eventHelpers.updateBasketOpluxExaminationResult(currentBasket);
        return next();
    }
);

server.append(
    'PlaceOrder',
    server.middleware.post,
    server.middleware.https,
    function (req, res, next) {
        var URLUtils = require('dw/web/URLUtils');
        var OrderMgr = require('dw/order/OrderMgr');
        var OpluxCallHelpers = require('*/cartridge/scripts/utils/opluxCallHelpers');
        var viewData = res.getViewData();
        var orderID = session.privacy.orderNo;
        if (orderID) {
            var order = OrderMgr.getOrder(orderID);
            if (order && viewData.error) {
                var isValid = OpluxCallHelpers.opluxResultValidation(order);
                if (!isValid) {
                    res.json({
                        error: true,
                        cartError: true,
                        redirectUrl: URLUtils.url('Page-Show', 'cid', 'opluxEventNG').toString()
                    });
                }
            }

            /// OPLUX: process order status by Oplux
            OpluxCallHelpers.postProcess(order);
            // clear orderNo from cache
            session.privacy.orderNo = null;
            session.privacy.model_id = null;
        }
        return next();
    }
);


module.exports = server.exports();
