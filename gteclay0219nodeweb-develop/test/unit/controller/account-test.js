'use strict';

var assert = require('assert');
var util = require('../../util');
var serviceMock = require('../../fixtures/mock/service/servicecore');
var requestMock = require('../../fixtures/mock/net/request');
var responseMock = require('../../fixtures/mock/net/response');

var accountController;

describe('@controller@account@', function () {
    before(function (done) {
        serviceMock.setup();
        accountController = require('../../../controllers/account');
        done();
    });
    after(function (done) {
        serviceMock.teardown();
        done();
    });
    it('exports a function with arity of 3', function (done) {
        util.tryCatchDone(function () {
            assert.equal(accountController.length, 3);
        }, done);
    });
    describe('@routeHandler@', function () {
        it('assembles AccountModel and calls res.render(\'account\')', function (done) {
            var request = requestMock();
            var response = responseMock(done, 'account', function (model) {
                assert.ok(model.activity && model.fx);
            });
            var next = function (err) {
              if (err) {
                  console.error(err);
                  done(err);
              }
            };

            accountController(request, response, next);
        });
    });
});
