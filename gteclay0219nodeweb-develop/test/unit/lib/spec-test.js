'use strict';

var spec = require('../../../lib/spec'),
  util = require('../../util'),
  assert = require('assert');
describe('@lib@spec@', function () {
    it('exports a function which returns an object with vault and onconfig props', function (done) {
        var specObj = spec();
        util.tryCatchDone(function () {
            assert.equal(specObj.vault, undefined);
            assert.equal((specObj.onconfig instanceof Function), true);
        },done);
    });
    describe('@onconfig@', function () {
        it('calls next with passed in config', function (done) {
            var specObj = spec();
            specObj.onconfig({'foo': 'bar'}, function (err, config) {
                util.tryCatchDone(function () {
                    assert.deepEqual(config, {'foo': 'bar'});
                },done);
            });
        });
    });
});