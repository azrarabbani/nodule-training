'use strict';

var locale = require('locale');


module.exports = function AccountModel(req, user, activity, wallet, fx) {

    var model = {}, actor, formatter, results, errors;
    var griffin = req.locality.griffin;
    function formatAmount(type) {
        if (type && !isNaN(type.amount)) {
            return griffin.formatNumber({currency:type.currencyCode, value:type.amount}, 
              griffin.CURRENCY_FORMAT);
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
    if (wallet && wallet.balance_accounts) {
        var balanceAccounts = wallet.balance_accounts;
        for (var i = 0; i < balanceAccounts.length; i++) {
            if (balanceAccounts[i].primary && balanceAccounts[i].sub_balances) {
                var balances = balanceAccounts[i].sub_balances;
                for (var j = 0; j < balances.length; j++) {
                    if ((balances[j].type && balances[j].type === 'TOTAL_BALANCE') && balances[j].amount) {
                        model.balance = formatter.formatCurrency(balances[j].amount.value, balances[j].amount.currency);
                        model.balance = griffin.formatNumber({value: balances[j].amount.value, 
                          currency: balances[j].amount.currency}, griffin.CURRENCY_FORMAT);
                    }
                }
            }
        }
    }

    // Account activity
    model.activity = [];

    if (formatter && (results = activity && activity.activities)) {
        results.forEach(function (result) {

            var entitySummary = result.target_entity,
                feeAmount = {amount: 0, currencyCode: 'USD'},
                grossAmount = {amount: 0, currencyCode: 'USD'};

            if (entitySummary.amount) { //Not all transactions are payments.
                feeAmount = {
                    amount: entitySummary.amount.fee.value,
                    currencyCode: entitySummary.amount.fee.currency
                };
                grossAmount = {
                    amount: entitySummary.amount.gross.value,
                    currencyCode: entitySummary.amount.gross.currency
                };
            }

            var target = model.name;
            if (result.counterparty) {
                target = result.counterparty.name ?
                    (result.counterparty.name.first_name + ' ' + result.counterparty.name.last_name):
                    result.counterparty.email;
            }


            model.activity.push({
                date: griffin.formatDate(new Date(result.time), griffin.DATE_FORMAT_SHORT),
                type: entitySummary.type,
                name: target,
                status: entitySummary.status,
                fee: formatAmount(feeAmount),
                gross: formatAmount(grossAmount)
            });
        });
    }

    //Convoluted example of ffxfx
    var fxConfig = req.app.kraken.get('fx-example');
    model.fx = {
        from: griffin.formatNumber(
          { value: parseInt(fxConfig.from.amountCents, 10)/100, 
            currency: fxConfig.from.currencyCode}, griffin.CURRENCY_FORMAT),
        to: griffin.formatNumber({value: parseInt(fx.amount_out.amount, 10)/100, 
          currency: fx.amount_out.code}, griffin.CURRENCY_FORMAT)
    };


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
    model.date = griffin.formatDate(new Date(), griffin.DATE_FORMAT_FULL);

    return model;
};