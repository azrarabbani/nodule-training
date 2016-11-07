'use strict';

var Invoices = require('../models/invoices.js');

module.exports = {

    list: function (req, res) {
        var invoices = new Invoices(req),
            options = {};

        options.page = +(req.param('page')) || 0;
        options.page_size = +(req.param('page_size')) || 50;
        options.total_count_required = req.param('total_count_required') || true;

        invoices.list(options, function (err, result) {
            var model = result;

            if (err) {
                throw err;
            }

            model.isLoggedIn = req.securityContext.actor.auth_state === 'LOGGEDIN';
            model.requestURI = req.app.kraken.get('requestURI');

            model.links = {};
            model.links.first = model.requestURI + '/invoices?page=0&page_size=' + options.page_size;
            model.links.prev = model.requestURI + '/invoices?page=' + (options.page - options.page_size <= 0 ? 0 : options.page - options.page_size) + '&page_size=' + options.page_size;
            model.links.next = model.requestURI + '/invoices?page=' + (options.page + options.page_size >= model.total_count - options.page_size ? ((model.total_count - options.page_size) <= 0 ? 0 : (model.total_count - options.page_size)) : options.page + options.page_size) + '&page_size=' + options.page_size;
            model.links.last = model.requestURI + '/invoices?page=' + (model.total_count - options.page_size <= 0 ? 0 : (model.total_count - options.page_size))+'&page_size=' + options.page_size;
            model.links.showing = (model.total_count === 0) ? '' : 'Showing ' + (options.page + 1) + '-' + (options.page + options.page_size > model.total_count ? model.total_count : options.page + options.page_size) + ' of ' + model.total_count;
            model.links.more = options.page + options.page_size >= model.total_count ? false : true;
            model.links.less = options.page === 0 ? false : true;
            res.render('invoices/index', model);
        });
    },

    createView: function (req, res) {
        var model = {},
            invoice;

        model.isLoggedIn = req.securityContext.actor.auth_state === 'LOGGEDIN';

        invoice = {
            'billing_info': [
                {
                    'email': 'example@example.com'
                }
            ],
            'items': [
                {
                    'name': 'Sutures',
                    'quantity': 100,
                    'unit_price': {
                        'currency': 'USD',
                        'value': '5'
                    }
                }
            ],
            'note': 'Medical Invoice 16 Jul, 2013 PST',
            'payment_term': {
                'term_type': 'NET_45'
            },
            'shipping_info': {
                'first_name': 'Sally',
                'last_name': 'Patient',
                'business_name': 'Not applicable',
                'phone': {
                    'country_code': '001',
                    'national_number': '5039871234'
                },
                'address': {
                    'line1': '1234 Broad St.',
                    'city': 'Portland',
                    'state': 'OR',
                    'postal_code': '97216',
                    'country_code': 'US'
                }
            }
        };

        model.invoice = JSON.stringify(invoice, null, 4);

        res.render('invoices/create', model);
    },

    create: function (req, res, next) {
        var invoices = new Invoices(req),
            invoice;

        try {
            invoice = JSON.parse(req.param('invoice'));
        } catch (err) {
            throw err;
        }

        invoices.create(invoice, function (err, result) {
            if (err) {
                req.log('error', err.message);
                next(err);
                return;
            }

            res.redirect(req.app.kraken.get('requestURI') + '/invoices');
        });
    },

    delete: function (req, res) {
        var invoices = new Invoices(req);

        invoices.delete(req.param('id'), function (err, result) {
            res.redirect(req.app.kraken.get('requestURI') + '/invoices');
        });
    }
};