'use strict';


var async = require('async'),
    path = require('path'),
    servicecore = require('servicecore'),
    ActorAccountModel = require('../models/actorAccount'),
    AccountModel = require('../models/account'),
    LoadUserDataModel = require('../models/loadUserData'),
    ActivitySearchModel = require('../models/activitySearch'),
    GetBalancesModel = require('../models/getBalances'),
    GetEquivModel = require('../models/getEquiv'),
    userReadClient,
    activitySearchClient,
    walletFIClient,
    ffxfxClient;
var cal = require('cal');

userReadClient = servicecore.create('userread-paypal');
activitySearchClient = servicecore.create('walletactivitysearch-paypal');
walletFIClient = servicecore.create('fimanagementservice_ca-paypal');
ffxfxClient = servicecore.create('ffxfx-paypal');
var userplatformServclient = servicecore.create('userplatformserv');

//Example



module.exports = function (req, res, next) {
    var actor = req.securityContext && req.securityContext.actor;
    //ADDING    CAL Logging
    var transaction = cal.createTransaction('TRAN-name', 'TRAN-type' );
    transaction.addData('tranData' , 'tranData');
    transaction.flush();

    async.parallel({// this is hash of functions
        user: function (callback) {
            var model = new LoadUserDataModel(actor);

            userReadClient.load_user_data(model, function (err, result) {
                callback(err, result && result.body);
            });
        },
        activity: function (callback) {
            var model = new ActivitySearchModel(actor),
                account = new ActorAccountModel(actor);

            activitySearchClient.getPaymentActivities(account, model, function (err, result) {
                callback(err, result && result.body);
            });
        },
        wallet: function (callback) {
            var model = {
                inline: new GetBalancesModel(actor)
            },
            account = new ActorAccountModel(actor);

            walletFIClient.getBalanceAccounts(account, model, function (err, result) {
                callback(err, result && result.body);
            });
        },
        fx: function (callback) {

            var fxConfig = req.app.kraken.get('fx-example');
            var model = new GetEquivModel(fxConfig.from.amountCents, fxConfig.from.currencyCode, fxConfig.to.currencyCode);

            ffxfxClient.get_equiv(model, function (err, result) {
                callback(err, result && result.body.result);
            });
        }

}, function (err, result) {// this is the callback method
        var model;

        if (err) {
			var event = cal.createEvent('name','type');
            event.status = cal.Status.ERROR;
            event.addData( 'msg', 'Error reading account data.');
            event.complete();
            req.log('error', err);
            transaction.status = cal.Status.ERROR;
            transaction.complete();
            next(err);
            return;

        }


        model = new AccountModel(req, result.user.result, result.activity, result.wallet, result.fx);
        model.requestURI = req.app.kraken.get('requestURI');
        transaction.complete();
        res.render('account', model);
    }
    );
};
