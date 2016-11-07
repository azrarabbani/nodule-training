'use strict';


module.exports = function GetBalancesModel(actor) {
    return {
        accountNumber: actor.account_number,
        id: actor.id,
        actorSessionId: actor.id
    };
};