'use strict';

var assert = require('assert');
var util = require('../../../util');

module.exports = function (next, viewName, assertions) {
    return {
        render: function (view, model) {
            util.tryCatchDone(function () {
                assert.equal(view, viewName);
                assert.ok(model);
                (assertions) ? assertions(model) : null;
            }, next);
        }
    };
}