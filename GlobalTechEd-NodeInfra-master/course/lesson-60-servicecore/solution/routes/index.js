'use strict';

var ppauth = require('auth-paypal'),
    accountController = require('../controllers/account'),
    invoicesController = require('../controllers/invoices'),
    loginRequired = ppauth.authorize({ failureRedirect: '/sampleapp/login/failure' });

module.exports = function (router) {

    router.get('/login', function (req, res) {
        res.redirect(req.app.kraken.get('requestURI'));
    });

    router.post('/login', ppauth.login({
        //successRedirect: '/sampleapp/account',
        successRedirect: '/sampleapp/invoices',
        failureRedirect: '/sampleapp/login/failure'
    }));

    router.get('/login/failure', function (req, res) {
        req.log('info', 'Incorrect login credentials entered by user.');
        res.redirect(req.app.kraken.get('requestURI'));
    });

    router.get('/logout', ppauth.logout(), function (req, res) {
        res.redirect(req.app.kraken.get('requestURI'));
    });

    router.get('/', function (req, res) {
        var model = {
            requestURI: req.app.kraken.get('requestURI'),
            isLoggedIn: (req.securityContext && req.securityContext.actor.auth_state === 'LOGGEDIN')
        };
        res.render('index', model);
    });

    router.get('/account', loginRequired, accountController);

    router.get('/invoices', loginRequired, invoicesController.list);
    router.get('/invoices/create', loginRequired, invoicesController.createView);
    router.post('/invoices/create', loginRequired, invoicesController.create);
    router.get('/invoices/delete/:id', loginRequired, invoicesController.delete);
};