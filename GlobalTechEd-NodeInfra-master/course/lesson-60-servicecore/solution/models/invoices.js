'use strict';

var servicecore = require('servicecore'),
    invoices = servicecore.create('invoicingserv'),
    User = require('./user');

function Invoices(req) {
    this.req = req;
}

Invoices.prototype = {

    list: function (options, callback) {
        options = options || {};

        // list invoices
        invoices.request({
            method: 'GET',
            path: '/v1/invoicing/invoices',
            qs: 'page=' + (options.page ? options.page : '0') + '&page_size=' + (options.page_size ? options.page_size : '10') +'&total_count_required=' + (options.total_count_required ? options.total_count_required : true)
        }, function (err, response) {
            callback(err, response.body);
        });
    },

    create: function (invoice, callback) {
        var user = new User(this.req);

        user.loadData(function (err, user) {
            if (!err) {

                invoice.merchant_info = {
                    'email': user.email,
                    'first_name': 'Dennis',
                    'last_name': 'Doctor',
                    'business_name': 'Medical Professionals, LLC',
                    'phone': {
                        'country_code': '001',
                        'national_number': '5032141716'
                    },
                    'address': {
                        'line1': '1234 Main St.',
                        'city': 'Portland',
                        'state': 'OR',
                        'postal_code': '97217',
                        'country_code': 'US'
                    }
                };

                // create new invoice
                invoices.request({
                    method: 'POST',
                    path: '/v1/invoicing/invoices',
                    body: JSON.stringify(invoice)
                }, function (err, response) {

                    if (response && /^[45]/.test(response.statusCode)) {
                        err = new Error(response.statusCode);
                        err.statusCode = response.statusCode;
                        try {
                            err.response = response.body;
                            err.message = JSON.stringify(response.body);
                        } catch (e) {
                            //swallow error
                        }
                    }

                    callback(err, response.body);
                });
            } else {
                callback(err);
            }
        });
    },

    delete: function (invoiceId, callback) {
        // delete invoice
        invoices.request({
            method: 'DELETE',
            path: '/v1/invoicing/invoices/' + invoiceId
        }, function (err, response) {
            callback(err, response.body);
        });
    }
};

module.exports = Invoices;