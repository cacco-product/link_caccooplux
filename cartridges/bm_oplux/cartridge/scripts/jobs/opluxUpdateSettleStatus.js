var Logger = require('dw/system/Logger').getLogger('OpluxJobLog', 'O-PLUX');
var Transaction = require('dw/system/Transaction');
var StringUtils = require('dw/util/StringUtils');
/**
 * Search orders before payment, paid, and canceled
 * @returns {dw.util.SeekableIterator} orders
 */
function searchStatusChangedOrders() {
    var OrderMgr = require('dw/order/OrderMgr');
    var Order = require('dw/order/Order');
    var Constants = require('*/cartridge/scripts/utils/constants');

    var orders = OrderMgr.searchOrders(
        "custom.oplux_event_id != NULL AND " +
            "custom.oplux_skip_update_settle_status != TRUE AND " +
            "( custom.oplux_settle_status={0} OR ( custom.oplux_settle_status={1} AND status={2}))",
        "creationDate asc",
        Constants.EVENT_REQUEST_SETTLE_DEFAULT_STATUS.BEFORE_BILLING,
        Constants.EVENT_REQUEST_SETTLE_DEFAULT_STATUS.AFTER_BILLING,
        Order.ORDER_STATUS_CANCELLED
    );
    return orders;
}

/**
 * Search orders that has passed the payment deadline
 * @returns {dw.util.SeekableIterator} orders
 */
function searchPastDueForPaymentOrders() {
    var OrderMgr = require('dw/order/OrderMgr');
    var Constants = require('*/cartridge/scripts/utils/constants');

    var orders = OrderMgr.searchOrders(
        "custom.oplux_event_id != NULL AND custom.oplux_skip_update_settle_status != TRUE AND " +
            "custom.oplux_settle_status = {0}",
        "creationDate asc",
        Constants.EVENT_REQUEST_SETTLE_DEFAULT_STATUS.PAYMENT_OVERDUE
    );
    return orders;
}

/**
 * Update order settle status
 * @param {dw.util.SeekableIterator} orders
 * @returns {undefined}
 */
function updateOpluxOrderSettleStatus(orders) {
    var SettleStatusFinder = require('*/cartridge/scripts/jobs/opluxSettleStatusFinder');
    var Order = require('dw/order/Order');
    var Constants = require('*/cartridge/scripts/utils/constants');

    while(orders.hasNext()){
        var order = orders.next();
        var isSkipUpdate = false;
        Logger.info("=========================={0} START=============================", order.getOrderNo());

        Logger.info("[OrderNo:{0}] OrderStatus: {1}, paymentStatus: {2}, shippingStatus: {3}", order.getOrderNo(), order.getStatus(), order.getPaymentStatus(), order.getShippingStatus());

        var paymentMethodId = order.paymentInstruments.empty ? 'NO_PAYMENT' : order.paymentInstruments[0].paymentMethod;
        var paymentMethod = dw.order.PaymentMgr.getPaymentMethod(paymentMethodId);
        var opluxPaymentId = paymentMethod.custom.oplux_payment_method.value;
        if (opluxPaymentId === Constants.PAYMENT_METHOD.CREDIT_CARD && order.status === Order.ORDER_STATUS_COMPLETED) {
            isSkipUpdate = true;
            Logger.debug("[OrderNo:{0}] paymentMethod: {1}", order.getOrderNo(), paymentMethodId);
        }
        if (order.custom.oplux_event_ma_result === Constants.EVENT_STATUS.NG || order.custom.oplux_event_aa_result === Constants.EVENT_STATUS.NG) {
            isSkipUpdate = true;
            Logger.debug("[OrderNo:{0}] aaResult: {1}, maResult: {2}", order.getOrderNo(), order.custom.oplux_event_aa_result, order.custom.oplux_event_ma_result);
        }

        try{
            if (isSkipUpdate) {
                Logger.info("[OrderNo:{0}] UPDATE oplux_skip_update_settle_status: {1}", order.getOrderNo(), isSkipUpdate);
                Transaction.wrap(function(){
                    order.custom.oplux_skip_update_settle_status = isSkipUpdate;
                });
            } else {
                // Check Updating settle status is required.
                var newSettleStatus = SettleStatusFinder.getSettleStatus(order);
                Logger.debug("[OrderNo:{0}] current Settle Status: {1}, new Settle Status: {2}", order.getOrderNo(), order.custom.oplux_settle_status.value, newSettleStatus || '00');
                if (opluxPaymentId === Constants.PAYMENT_METHOD.CREDIT_CARD && newSettleStatus === Constants.EVENT_REQUEST_SETTLE_DEFAULT_STATUS.AFTER_BILLING) {
                    Logger.debug("[OrderNo:{0}] skip update settle status 20 when payment method is CREDIT_CARD", order.getOrderNo());
                } else {
                    updateSettleStatus(order, newSettleStatus);
                }
            }
        } catch(e) {
            Logger.error("[OrderNo:{0}] Oplux Update SettleStatus is failed. : \n{1}", order.getOrderNo(), e);
            Transaction.wrap(function(){
                order.custom.oplux_error = StringUtils.format("[{0}]{1}", new Date(), e.message);
            });
        }

        Logger.info("=========================={0} END=============================", order.getOrderNo());
    }
}

/**
 * opluxUpdateSettleStatus is executed.
 */
function execute( args : PipelineDictionary ) : Number
{
    Logger.info("================================UpdateSettleStatus START======================================");

    updateOpluxOrderSettleStatus(searchStatusChangedOrders());
    updateOpluxOrderSettleStatus(searchPastDueForPaymentOrders());

    Logger.info("================================UpdateSettleStatus END======================================");
    return PIPELET_NEXT;
}
/**
 * @param {Object} order
 * @param {string} newSettleStatus
 * @returns {undefined}
 */
function updateSettleStatus(order, newSettleStatus){
    var OpluxServices = require('*/cartridge/scripts/utils/opluxServices');
    var EventHelpers = require('*/cartridge/scripts/utils/eventHelpers');
    var Constants = require('*/cartridge/scripts/utils/constants');

    var eventID = order.custom.oplux_event_id;
    if(!newSettleStatus || empty(newSettleStatus)){
        Logger.info("[OrderNo:{0}] Settle status not change. Skip this time.", order.getOrderNo());
    } else {
        if(newSettleStatus != order.custom.oplux_settle_status){
            // Update settle status to Oplux system.
            var result = OpluxServices.updateEventInfo(eventID, {settleStatus: newSettleStatus});
            if(result.isOk()){
                var parsed = EventHelpers.parseToXML(result.getObject());
                if(parsed.result.toString() === Constants.EVENT_STATUS_CODE.OK){
                    Transaction.wrap(function(){
                        order.custom.oplux_settle_status = newSettleStatus;
                    });
                }
                else{
                    throw "Oplux Update SettleStatus Error : \n" + parsed.toXMLString();
                }
            }
            else{
                var errStr = StringUtils.format("Status:{0}\nError:{1}\nMessage:{2}\nErrorMessage:{3}",
                        result.getStatus(), result.getError(), result.getMsg(), result.getErrorMessage());
                throw "Oplux Update SettleStatus API Error : \n" + errStr;
            }
        }
    }
}

exports.execute = execute;