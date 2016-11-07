'use strict';

var routes,
  util = require('../../util'),
  assert = require('assert');
describe('@routes@', function () {
    it('exports a function with arity of 1', function (done) {
        routes = require('../../../routes');
        util.tryCatchDone(function () {
            assert.equal(routes.length, 1);
        },done);
    });
});