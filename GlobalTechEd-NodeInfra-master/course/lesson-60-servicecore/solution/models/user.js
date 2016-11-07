'use strict';

var servicecore = require('servicecore'),
	userReadClient = servicecore.create('userread-paypal'),
    LoadUserDataModel = require('../models/loadUserData');

function User(req) {
	this.req = req;
}

User.prototype = {
	loadData: function (callback) {
		var actor = this.req.securityContext.actor,
            model = new LoadUserDataModel(actor);

        userReadClient.load_user_data(model, function (err, result) {
            var user = {};

            if (!err) {
                if (result && result.body && result.body.result && result.body.result.email && result.body.result.email[0] && result.body.result.email[0].email) {
                    user.email = result.body.result.email[0].email;
                }

                callback(null, user);
            } else {
                callback(err);
            }
        });
	}
};

module.exports = User;