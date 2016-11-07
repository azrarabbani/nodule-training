'use strict';

var accountModel = require('../../../models/account'),
  util = require('../../util'),
  assert = require('assert');
describe('@models@account@', function () {
    it('exports a function with arity of 5', function (done) {
        util.tryCatchDone(function () {
            assert.equal(accountModel.length, 5);
        }, done);
    });
});