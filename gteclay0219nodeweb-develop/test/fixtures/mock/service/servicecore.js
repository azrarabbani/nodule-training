'use strict';

var servicecore = require('servicecore');
var sinon = require('sinon');
var path = require('path');

module.exports.setup = function () {
    //TODO: modularize this
    //TODO: add a configuration to allow for svc latency and even error conditions
    var endpoint = function (name) {
        return function () {
            var cb = arguments[arguments.length - 1];
            var mock = require(path.resolve(__dirname, name));
            process.nextTick(function () {
                cb(null, mock);
            });
        };
    };

    //TODO: just read service endpoints from the FS so we don't need to explicitly define
    var svcs = {
        'userread-paypal': {
            load_user_data: endpoint('userread-paypal/load_user_data')
        },
        'walletactivitysearch-paypal': {
            getPaymentActivities: endpoint('walletactivitysearch-paypal/getPaymentActivities')
        },
        'ffxfx-paypal': {
            get_equiv: endpoint('ffxfx-paypal/get_equiv')
        },
        'fimanagementservice_ca-paypal': {
            getBalanceAccounts:  endpoint('fimanagementservice_ca-paypal/getBalanceAccounts')
        }
    };

    sinon.stub(servicecore, 'create', function (svc) {
        return svcs[svc];
    });
};

module.exports.teardown = function () {
    servicecore.create.restore();
};

