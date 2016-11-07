"use strict";

module.exports = function () {
    return function (err, req, res, next) {
        if (req.app.kraken.get('env:development')) {
            console.warn("Error handling middleware called. Please update lib/errorHandler.js to do something meaningful or remove it from your config.");
        }

        // Pass the error on to the next error handler, or Express's default.
        next(err);
    };
};
