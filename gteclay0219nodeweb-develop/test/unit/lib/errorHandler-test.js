'use strict';

var errorHandler = require('../../../lib/errorHandler'),
  util = require('../../util'),
  assert = require('assert');
describe('@lib@errorHandler@', function () {
    it('exports a function which returns a function with arity of 4', function (done) {
        util.tryCatchDone(function () {
            assert.equal(errorHandler().length, 4);
        },done);
    });
});