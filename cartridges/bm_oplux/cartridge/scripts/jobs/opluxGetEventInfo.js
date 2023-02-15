var Calendar = require('dw/util/Calendar');
var Order = require('dw/order/Order');
var Transaction = require('dw/system/Transaction');
var StringUtils = require('dw/util/StringUtils');
var Logger = require('dw/system/Logger').getLogger('OpluxJobLog', 'O-PLUX');

/**
 * opluxGetEventInfo is executed.
 */
function execute() {
    var Constants = require('*/cartridge/scripts/utils/constants');
    if(!Constants.RUN_BACKGROUND_JOB)
        return;

    try{
        var twoDaysAgo = new Calendar();
        twoDaysAgo.add(Calendar.DAY_OF_MONTH, -2);
        GetEventMAInfo(twoDaysAgo);
    }
    catch(e){
        Logger.error(e);
    }
    return;
}
/**
 * @param {Date} twoDaysAgo
 * @returns {undefined}
 */
function GetEventMAInfo(twoDaysAgo){
    var OrderMgr = require('dw/order/OrderMgr');
    var OpluxServices = require('*/cartridge/scripts/utils/opluxServices');
    Logger.info("[Oplux-Job] GetEventInfo START");
    // 対象の注文情報を取得
    var orders = OrderMgr.searchOrders(
            "creationDate > {0} AND custom.oplux_event_id != NULL AND " +
            "(custom.oplux_event_aa_result={1} OR custom.oplux_event_aa_result={2}) AND " +
            "custom.oplux_event_ma_result=NULL AND " +
            "status != {3} AND status != {4}",
            null,
            twoDaysAgo.getTime().toISOString(),
            'REVIEW',
            'HOLD',
            Order.ORDER_STATUS_FAILED,
            Order.ORDER_STATUS_CANCELLED
    );

    while(orders.hasNext()){
        try{
            var order = orders.next();
            Logger.debug("[OrderNo:{0}] Get event info. START", order.getOrderNo(), order.getStatus());
            var eventID = order.custom.oplux_event_id;
            if(!eventID) {
                continue;
            }

            // イベント情報を取得
            var eventInfoResult = OpluxServices.getEventInfo(eventID);
            if(!eventInfoResult.isOk()){
                throw StringUtils.format("getEventInfo is failed. : \n{0}\n{1}\n{2}\n{3}",
                        eventInfoResult.getStatus(),
                        eventInfoResult.getErrorMessage(),
                        eventInfoResult.getError(),
                        eventInfoResult.getMsg());
            }
            var parsedResult = new XML(eventInfoResult.getObject());

            if(parsedResult.result.toString() == '10'){
                var eventList = parsedResult.events.event;
                if(eventList.length() < 1){
                    // イベント情報は来ていない。
                    Logger.error("[OrderNo:{0}] It has no event info.", order.getOrderNo());
                }
                else{
                    Transaction.wrap(handleEvent.bind(this, order, parsedResult.events.event[0]));
                }
                if(eventList.length() > 1) {
                    // イベントIDを一つ使って取得したイベント情報が複数になるのは可能？レスポンスの構造的には可能な構造だけど。
                    Logger.warn("[OrderNo:{0}] It has multi events.", order.getOrderNo());
                }
            }
            else{
                //Transaction.wrap(order.addNote.bind(this, "[Oplux-Job-opluxUpdate] GetEventInfo is failed.", parsedResult.toXMLString()));
                var descriptions = [];
                var errors = parsedResult.errors.error;
                for(var idx = 0; idx < errors.length(); idx++){
                    descriptions.push('[' + errors[idx].code + '] ' + errors[idx].message);
                }
                throw descriptions.join('／');
            }
        }
        catch(e){ // Do not stop processing orders. Just skip current order with error log.
            Logger.error("[OrderNo:{0}] " + e);
            Transaction.wrap(function(){
                order.custom.oplux_error = dw.util.StringUtils.format("[{0}]{1}", new Date(), e.message);
            });
        }

        Logger.info("[OrderNo:{0}] Get event info. END", order.getOrderNo());
    }
    Logger.info("[Oplux-Job] GetEventInfo END");
}

/**
 * Transaction is required
 * @param {Object} order
 * @param {Object} event
 * @returns {undefined}
 */
function handleEvent(order, event){
    var OrderMgr = require('*/cartridge/scripts/opluxOrderMgr');
    var Constants = require('*/cartridge/scripts/utils/constants');
    if(event.aaresult.skipped){
        order.custom.oplux_event_aa_result = event.aaresult.result.toString();
    }
    var maResult = event.maresult.result ? event.maresult.result.toString().toUpperCase() : '';
    var exportStatus = order.getExportStatus().value;
    if (maResult && exportStatus != Order.EXPORT_STATUS_EXPORTED) {
        Logger.debug("[GetEventInfo] handleEvent() START");
        order.custom.oplux_event_ma_result = maResult;
        order.custom.oplux_event_ma_result_memo = event.maresult.memo.toString();

        if (Constants.EVENT_STATUS.OK === maResult && order.exportStatus == Order.EXPORT_STATUS_NOTEXPORTED && order.confirmationStatus == Order.CONFIRMATION_STATUS_NOTCONFIRMED) {
            order.setExportStatus(Order.EXPORT_STATUS_READY);
            order.setConfirmationStatus(Order.CONFIRMATION_STATUS_CONFIRMED);
        } else if (Constants.EVENT_STATUS.NG === maResult && order.status != Order.ORDER_STATUS_CANCELLED) {
            OrderMgr.cancelOrder(order);
        } else if (Constants.EVENT_STATUS.HOLD === maResult) {
            order.setExportStatus(dw.order.Order.EXPORT_STATUS_NOTEXPORTED);
            order.setConfirmationStatus(dw.order.Order.CONFIRMATION_STATUS_NOTCONFIRMED);
        }
    }
}

exports.execute = execute;
