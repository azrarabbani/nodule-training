'use strict';

require('continuation-local-storage');

var kraken = require('kraken-js'),
    brogan = require('brogan-paypal'),
    express = require('express'),
    app = express(),
    spec = require('./lib/spec'),
    port = process.env.PORT || 8000;

app.use(kraken(brogan(spec())));

app.listen(port, function (err) {
    if (err) {
        console.error(err.message);
    } else {
        console.log('[%s] Listening on http://localhost.paypal.com:%d', app.settings.env.toUpperCase(), port);
    }
});