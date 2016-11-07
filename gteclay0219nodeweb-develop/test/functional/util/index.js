'use strict';

var Nemo = require('nemo');

module.exports.nemoSetup = function (before, after, addUserFlag) {
    before(function (done) {
        var next;
        switch (addUserFlag) {
            case 'new':
                next = addUser(this, done);
                break;
            case 'static':
                next = addUserStatic(this, done);
                break;
            default:
                next = done;
                break;
        }
        this.nemo = Nemo(function (err) {
            if (err) {
                done(err);
                return;
            }
            next();
        });
    });
    after(function (done) {
        this.nemo.driver.quit().then(function () {
            done();
        });
    });
};

module.exports.waitForJSReady = function waitForJSReady(nemo) {
    return nemo.driver.wait(function () {
          return nemo.driver.executeScript(function () {
              return window.readyToGo;
          });
      }
      , 10000, 'JavaScript didn\'t load');
};

var addUser = function (context, done) {
    return function () {
        var nemo = context.nemo;
        nemo.jaws({
            restPath: '/user',
            method: 'post',
            data: {
                'country': 'US'
            }
        }).then(function (user) {
            context.user = user;
            done();
        });
    };
};

var addUserStatic = function (context, done) {
    return function () {
        context.user = {
            emailAddress: 'abc@paypal.com',
            password: '11111111'
        };
        done();
    };
};
