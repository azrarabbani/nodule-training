'use strict';

var locale = require('locale');


module.exports = function AccountModel(req, user, activity, wallet) {

    var model = {}, actor, formatter, results, errors;

    function formatAmount(type) {
        if (type && !isNaN(type.amount)) {
            return formatter.formatCurrency(type.amount);// + ' ' + type.currencyCode;
        } else {
            return false;
        }
    }

    // User details
    if (user && user.name) {
        model.name = user.name[0].user_full_name;
    }
    // Update formatter with user details
    if (req && req.locality) {
        formatter = locale.formatter(req.locality.country, req.locality.culture);
    }

    // Financial instruments
    if (wallet && wallet.total_available) {
        model.balance = wallet.total_available.amount + ' ' + wallet.total_available.currency;
    }

    // Account activity
    model.activity = [];

    if (formatter && (results = activity && activity.activities)) {
        results.forEach(function (result) {
            var entitySummary = result.target_entity,
                feeAmount = {
                    amount: entitySummary.amount.fee.value,
                    currencyCode: entitySummary.amount.fee.currency
                },
                grossAmount = {
                    amount: entitySummary.amount.gross.value,
                    currencyCode: entitySummary.amount.gross.currency
                };

            model.activity.push({
                date: formatter.format(new Date(result.time), 'd'),
                type: entitySummary.type,
                name: (result.counterparty && result.counterparty.name) ? result.counterparty.name.first_name + ' ' + result.counterparty.name.last_name : 'unknown',
                status: entitySummary.status,
                fee: formatAmount(feeAmount),
                gross: formatAmount(grossAmount)
            });
        });
    }

    // Log any errors
    if ((errors = activity && activity.errors)) {
        errors.forEach(function (err) {
            req.log('warn', err);
        });
    }

    // Is the user logged in?
    actor = req.securityContext.actor;
    model.isLoggedIn = actor.auth_state === 'LOGGEDIN';

    // Today's date
    model.date = formatter.format(new Date(), 'D');

    return model;
};