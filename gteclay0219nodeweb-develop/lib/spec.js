'use strict';

var shush = require('shush');

module.exports = function spec() {

    return {
        //The deployment scripts will insert a 'vault' section in config.json if the app uses shared keystore
        vault: shush('../config/config.json').vault,
        onconfig: function(config, next) {
            next(null, config);
        }
    };
};