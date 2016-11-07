'use strict';


var ppauth = require('auth-paypal');
var accountController = require('../controllers/account');
var unifiedLoginUrl = require('node-unified-login-url');
var ppaasController = require('../controllers/ppaas');

module.exports = function (router) {

    router.get('/login/failure', function (req, res) {
        req.log('info', 'Incorrect login credentials entered by user.');
        res.redirect(req.app.kraken.get('requestURI'));
    });

    router.get('/logout', function (req, res) {
        var requestURI = req.app.kraken.get('requestURI');

        res.redirect(unifiedLoginUrl.getLogoutUrl(req, {returnUri: req.protocol + '://' + req.headers.host + requestURI }));
    });

    router.get('/', function (req, res) {
        var requestURI = req.app.kraken.get('requestURI'),
            accountPage = 'account';
            
        var model = {
            accountPage: accountPage,
            isLoggedIn: (req.securityContext && req.securityContext.actor.auth_state === 'LOGGEDIN'),
            redirectUrl: unifiedLoginUrl.getLoginUrl(req, {returnUri: req.protocol + '://' + req.headers.host + requestURI + '/' + accountPage}),
            requestURI: requestURI
        };
        res.render('index', model);
    });
    router.get('/account', ppauth.authorize({failureRedirect: '/sampleapp/login/failure'}), accountController);

    router.get('/userplatformserv', ppauth.authorize({failureRedirect: '/sampleapp/login/failure'}), ppaasController);

};
