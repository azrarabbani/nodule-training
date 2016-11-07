'use strict';


module.exports = function GetBalancesModel(actor) {
    return {
        user: actor.account_number
    };
};