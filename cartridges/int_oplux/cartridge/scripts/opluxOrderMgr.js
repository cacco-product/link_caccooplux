/**
* Description of the module and the logic it provides
* @module cartridge/scripts/opluxOrderMgr
*/

'use strict';

var OrderMgr = require('dw/order/OrderMgr');
var mailHelpers = require('*/cartridge/scripts/utils/mailHelpers');

var opluxOrderMgr = {
    original: OrderMgr,
    __noSuchMethod__: function (methodName, methodArgs) {
        if (methodName in this.original && typeof this.original[methodName] === 'function') {
            return this.original[methodName].apply(this.original, methodArgs);
        }
        // If the method cannot be found.
        Logger.error('Method "{0}" does not exist for {1}', methodName, this.object.class);
        throw new TypeError();
    },
    failOrder: function (order, reopenBasketIfPossible) {
        var result = this.original.failOrder.apply(this.original, arguments);
        return result;
    },
    cancelOrder: function (order) {
        var result = this.original.cancelOrder.apply(this.original, arguments);
        mailHelpers.sendCancelEmail(order);
        return result;
    }
};

module.exports = opluxOrderMgr;
