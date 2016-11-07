'use strict';

var servicecore = require('servicecore'),
    client = servicecore.create('userplatformserv');
var util = require('util');

module.exports = function (request, res) {


    client.request({
        method: 'GET',
        path: '/v1/customer/accounts',
        qs: {
            public_credential_value: 'CNARASIMHAN-PERS-RU5@PAYPAL.COM',
            channel: 'WEB'
        }
    }, function (err, response) {
        if(err){
            console.log(err);
        }
//Display web service response on console & the browser
        var wsresp = util.inspect(response.body);
        console.log('Web service response: \n' + wsresp);
        res.end(wsresp);
    });
}