'use strict';


var async = require('async'),
    servicecore = require('servicecore'),
    userRead = require('userread-paypal'),
    userRelationship = require('userrelationship-paypal'),
    walletActivity = require('walletactivitysearch-paypal'),
    walletFI = require('walletfi-paypal'),
    ActorAccountModel = require('../models/actorAccount'),
    AccountModel = require('../models/account'),
    LoadUserDataModel = require('../models/loadUserData'),
    LoadRelationshipsDataModel = require('../models/loadRelationships'),
    ActivitySearchModel = require('../models/activitySearch'),
    GetBalancesModel = require('../models/getBalances'),
    userReadClient,
    userRelationshipClient,
    activitySearchClient,
    walletFIClient;

servicecore.register('userread-paypal', userRead);
servicecore.register('userrelationship-paypal', userRelationship);
servicecore.register('walletactivitysearch-paypal', walletActivity);
servicecore.register('walletfi-paypal', walletFI);

userReadClient = servicecore.create('userread-paypal');
userRelationshipClient = servicecore.create('userrelationship-paypal');
activitySearchClient = servicecore.create('walletactivitysearch-paypal');
walletFIClient = servicecore.create('walletfi-paypal');


module.exports = function (req, res, next) {
    var actor = req.securityContext.actor;

    async.parallel({
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
            var model = new GetBalancesModel(actor);

            walletFIClient.getBalances(model, function (err, result) {
                if (!err && result && result.body) {
                    callback(err, result && result.body);
                }
            });
        },
        relationship: function (callback) {
            var model = new LoadRelationshipsDataModel(actor);

            userRelationshipClient.load_relationships(model, function (err, result) {
                callback(err, result && result.body);
            });
        }
    }, function (err, result) {
        var model;

        if (err) {
            req.log('error', err.message);
            next(err);
            return;
        }

        model = new AccountModel(req, result.user.result, result.activity, result.wallet);
        model.requestURI = req.app.kraken.get('requestURI');

        res.render('account', model);
    });
};