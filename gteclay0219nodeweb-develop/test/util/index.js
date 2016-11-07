'use strict';

module.exports.tryCatchDone = function (assertions, done) {
    try {
        assertions();
    } catch (err) {
        done(err);
        return false;
    }
    done();
};