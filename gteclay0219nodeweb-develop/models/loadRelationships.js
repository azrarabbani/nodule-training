'use strict';


module.exports = function LoadUserDataModel(actor) {
    return {
        includeInactive: false,
        acct2acctCriteria: {
            id: 0,
            subjectAccount: 1731511286119924231,
            actingAccount: 1731511286119924231,
            type: 0
        },
        login2acctCriteria: {
            login: actor.loginId,
            account: actor.actorAccountNumber
        }
    };
};