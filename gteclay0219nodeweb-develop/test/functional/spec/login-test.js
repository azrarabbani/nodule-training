/*global describe:true, nemo:true, it:true, before:true, after:true*/
'use strict';

var util = require('../util'),
    nemo;

describe('Sample nemo test using plugins', function () {
    util.nemoSetup(before, after, 'static');
    it('should successfully login to my account page', function (done) {
        nemo = this.nemo;
        console.log('nemo data', nemo.data);
        nemo.driver.get(nemo.data.baseUrl);
        util.waitForJSReady(nemo);
        nemo.view.navigation.loginButton().click();
        nemo.view.login.usernameWait(5000);
        nemo.view.login.username().clear();
        nemo.view.login.username().sendKeys(this.user.emailAddress);
        nemo.view.login.password().clear();
        nemo.view.login.password().sendKeys(this.user.password);
        nemo.view.login.submitButton().click();
        nemo.view.navigation.logoutLinkWait(5000).click();
        nemo.view.navigation.loginButtonWait(5000).
            then(function () {
                done();
            }, function (err) {
                done(err);
            });
    });
});