'use strict';

//just enough request/response objects to get through the unit tests

module.exports = function () {
    return {
        securityContext: {
            actor: "true"
        },
        locality: {
            griffin: {
                formatNumber: function () {
                },
                formatDate: function () {
                }
            }
        },

        app: {
            kraken: {
                get: function () {
                    return {
                        from: {
                            amountCents: '100',
                            currencyCode: 'USD'
                        },
                        to: {
                            currencyCode: 'EUR'
                        }
                    }
                }
            }
        }
    }
};