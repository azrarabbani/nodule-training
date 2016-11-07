/**
 * Created by arabbani on 2/19/16.
 */
'use strict';

var servicecore = require('servicecore');
var util = require('util');
var cal = require('cal');


var userplatformServclient = servicecore.create('userplatformserv');


module.exports = function (req, res) {
    userplatformServclient.request({
                method: 'GET',
                path: '/v1/customer/accounts',
                qs: {
                    public_credential_value: 'CLAY-TESTER-12-4-047@CONFINITY.COM',
                    //private_credential_type: 'PASSWORD'
                    channel : 'WEB'
                }

       }
    , function (error, response) {
        if (error) {
            console.log(response.body);
        }
        var wsresp = util.inspect(response.body);
        console.log('' + wsresp);
        res.end(wsresp);

    });
};
