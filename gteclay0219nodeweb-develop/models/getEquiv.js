/**
 * Created by lmarkus on 11/1/14.
 */
'use strict';
var assert = require('assert');

/**
 * Converts a certain amount from one currency to another
 * @param amount Starting amount (in cents). Must be a string. (EG: $100.00 -> '10000')
 * @param currencyFrom Origin ISO currency code. (EG: 'USD')
 * @param currencyTo Destination ISO currency code. (EG: 'EUR')
 * @returns {{amount_in: {amount: *, code: *}, code_out: *}} a payload for invoking ffxfx.getEquiv
 * @constructor
 */
var GetEquiv = function GetEquiv(amount, currencyFrom, currencyTo) {

    assert(typeof amount === 'string');

    return {
        amount_in: {
            amount: amount,
            code: currencyFrom
        },
        code_out: currencyTo
    };
};

module.exports = GetEquiv;