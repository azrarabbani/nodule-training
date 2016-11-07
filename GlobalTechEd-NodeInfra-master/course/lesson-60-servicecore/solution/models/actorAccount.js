'use strict';


module.exports = function ActivitySearchModel(actor) {
    return {
        accountNumber: actor.account_number,
        id: actor.id
    };
};