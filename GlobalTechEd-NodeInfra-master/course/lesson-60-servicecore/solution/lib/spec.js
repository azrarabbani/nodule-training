'use strict';

module.exports = function spec() {

    return {
        vault: require('../config/config.json').vault,
        onconfig: function(config, next) {
            next(null, config);
        }
    };
};