# Sample PayPal Node.js App

[![Dependency Status](http://daviddm-localhost3001.qa.paypal.com:1337/nodejs/sample-app.svg?theme=shields.io)](http://daviddm-localhost3001.qa.paypal.com:1337/nodejs/sample-app)
[![devDependency Status](http://daviddm-localhost3001.qa.paypal.com:1337/nodejs/sample-app/dev-status.svg?theme=shields.io)](http://daviddm-localhost3001.qa.paypal.com:1337/nodejs/sample-app#info=devDependencies)

This repo is intended to be a learning tutorial for making your first webcore application at PayPal. All of the code is included along with a step-by-step walk through of how it was created.

The easiest and suggested way to start is to clone the sample app:

```bash
$ git clone git@github.paypal.com:PPaaS/sample-app.git
$ cd sample-app
$ npm install
$ node .
```
See your sample-app at [http://localhost:8000/sampleapp](http://localhost:8000/sampleapp)

If, however, you came here to learn, then you should follow the tutorial below to build a PayPal application.


## 1. Initial setup

First things first, let's make sure node.js is working properly:

1. [Set up your node.js environment](https://github.paypal.com/nodejs/getting-started/blob/master/README.md)
2. [Create a kraken application](http://krakenjs.com/#gettingstarted)

    Select Dust as the template Library, LESS as the CSS preprocessor library, and None for the Javascript library.

    ```
    npm install -g yo generator-kraken bower
    yo kraken
    ```

    If you experience bower issues with generating a kraken app, it can be helpful to create a .bowerrc file in your project's directory.  During the generation process it will ask to overwrite this file, do not allow it.

    ```
    {
        "directory": "public/components",
        "json": "component.json",
        "registry": {
            "search": [
                "http://components.paypal.com/",
                "https://bower.herokuapp.com"
            ]
        }
    }
    ```

3. [See your application running](http://localhost:8000)

If your application says "Hello, index" congratulations, you can proceed to step 2.

## 2. Now let's configure your app for PayPal

You just created a vanilla kraken app, but now we want to add support for PayPal's infrastructure. Luckily, [brogan](https://github.paypal.com/NodeInfra/brogan) makes this easy for you. Run the following command in your terminal to install it and the other required PayPal dependencies:

```
npm install --save servicecore
npm install --save auth-paypal
npm install --save brogan-paypal
npm install --save cal
npm install --save commons-paypal
npm install --save connect-mayfly
npm install --save continuation-local-storage
npm install --save encryptedcookies-paypal
npm install --save express-meta
npm install --save express-session
npm install --save locale
npm install --save nconf
npm install --save passport
npm install --save pplogger
npm install --save securitycontext-paypal
npm install --save topos
npm install grunt-contrib-requirejs --save-dev
```

That should take a minute or two, but once it's done you'll want to update your application per the [brogan README](https://github.paypal.com/NodeInfra/brogan/tree/servicecore.next#api).

Update your app's index.js to use brogan:

```
var brogan = require('brogan-paypal'),
options = {
    onconfig: function (config, next) {
        next(null, config);
    }
};
app.use(kraken(brogan(options)));
```

### Logging
Logging in production is through CAL, but this is abstracted with [pplogger](https://github.paypal.com/NodeInfra/pplogger#api). Add the logger configuration value to the middleware section of `config/development.json` to enable console logging in development:

```
"logger": {
    "type": "console",
    "format": "console",
    "level": "debug"
}
```

Add the logger configuration value to the middleware section of `config/config.json` to enable `cal` logging in stage and live environments.

```
"logger": {
    "type": "cal"
}
```

### Service Connectivity
Service discovery is done with [topos](https://github.paypal.com/NodeInfra/node-topos#node-topos). Add the following configuration value to `config/development.json` to tell your application to use services on a given stage:

```
"topos": {
    "host": "live.qa.paypal.com"
}
```

This value can be updated to use your team's stage.

### Sessions
Sessions are done with [mayfly](https://github.paypal.com/NodeInfra/connect-mayfly#connect-mayfly). Add the session configuration value to the middleware section of `config/config.json`:

```
"session": {
    "enabled": true,
    "priority": 100,
    "module": {
        "name": "connect-mayfly/middleware",
        "arguments": [{
            "cryptKey": "vault:encrypted_mayflysession_crypt_key",
            "macKey": "vault:encrypted_mayflysession_mac_key",
            "key": "UNIQUE_KEY",
            "secret": "UNIQUE_SECRET",
            "cookie": {
                "path": "/",
                "httpOnly": true,
                "maxAge": null
            },
            "proxy": null
        }]
    }
}
```

### Express mount point

Add the `requestURI` to `config/config.json`

```
"requestURI": "/sampleapp"
```

Add a mount path to 'express' configuration value to `config/config.json`

```
"express": {
    "view cache": false,
    "view engine": "js",
    "views": "path:./.build/templates",
    "mountpath": "/sampleapp"
}
```

The kraken app routes can be organized in multiple ways for a mount point.
One example is to create a routes directory in your app and the directory structure will be a simulation of the routing path.  So, creating a sampleapp folder under routes and putting all the subroutes under routes/sampleapp/index.js will mount those routes onto '/sampleapp'.  In our example we will, put all the routes in a single file.

Create 'routes/index.js'

```
'use strict';

var indexController = require('../controllers/index');

module.exports = function (router) {

    router.get('/', indexController.index);
};
```

Update/create 'controllers/index.js'

```
'use strict';

var IndexModel = require('../models/index');

exports.index = function (req, res) {
    var model = new IndexModel();

    res.render('index', model);
};
```

Also replace the `routes` middleware in `config/config.json` with

```
"router": {
    "module": {
        "arguments": [{
            "directory": "path:./routes"
        }]
    }
}
```

Route registration is highly customizable. If you're interested in trying a different behavior, be sure to check out the module that takes care of it in kraken: [express-enrouten](https://github.com/krakenjs/express-enrouten).
Let's start your application back up with `node index.js`. It should successfully start back up again, accessible at [http://localhost:8000/sampleapp](http://localhost:8000/sampleapp), this time writing a bit of extra information to the console front MayFly and locale. Your app still doesn't do anything awesome yet, so let's move on to the next step.

## 3. Add HTML and CSS

"Hello, index" is boring and too simple. Let's improve upon that.

1. Move the existing welcome template from `public/templates/index.dust` to `public/templates/welcome/index.dust`

2. Move the corresponding properties file also from 'locales\US\en\index.properties' to 'locales\US\en\welcome\index.properties'

3. Update the 'controllers/index.js' to point at the moved welcome template

    ```
    'use strict';

    var IndexModel = require('../models/index');

    module.exports = {

        index : function (req, res) {
            var model = new IndexModel();
            res.render('welcome/index', model);
        }
    };
    ```

4. Update the routes in 'routes/index.js'

    ```
    'use strict';

    var indexController = require('../controllers/index');

    module.exports = function (router) {

      router.get('/', function (req, res) {
            var model = {
                requestURI: req.app.kraken.get('requestURI'),
                isLoggedIn: (req.securityContext && req.securityContext.actor.auth_state === 'LOGGEDIN')
            };
             res.render('index', model);
         });

        router.get('/index', indexController.index);
    };
    ```

5. Create a new `public/templates/index.dust` and update the HTML to contain the following login form using [Dust.js](http://linkedin.github.io/dustjs/):

    ```
    {>"layouts/master" /}

    {<body}
        <h1>Log In</h1>
        <form action="{requestURI}/login" method="post" class="login-form">
            <p>
                <label for="username" class="control-label">username</label>
            	<input class='form-control' type="text" name="username" id="username" />
            </p>
            <p>
            	<label for="password" class="control-label">password</label>
            	<input type="password" class='form-control' name="password" id="password" />
            </p>

            <input value='login' type='submit' class="btn btn-primary">
            <input type="hidden" name="type" id="type" value="0" />
            <input type="hidden" name="_csrf" value="{_csrf}" />
        </form>
    {/body}
    ```

6. Next, we'll use *bower* to install two of our CSS libraries. From the terminal run:

    ```
    bower install px-forms
    bower install px-buttons
    ```

    If you receive an error mentioning GitHub private mode, you may need to try:

    ```
    git config --global url."https://github.paypal.com".insteadOf git://github.paypal.com
    ```

    If you receive an error mentioning ENOTFOUND Package px-base not found, verify that your Bower config is setup correctly based on https://github.paypal.com/pages/UIE-components/px-bootstrap/getting-started.html

    ```
    {
        "directory": "public/components",
        "json": "component.json",
        "registry": {
            "search": [
                "http://components.paypal.com/",
                "https://bower.herokuapp.com"
            ]
        }
    }
    ```

7. Import the LESS files from the previous step into your `public/css/app.less` file:

    ```
    @import "../components/px-base/less/px-base";
    @import "../components/px-forms/less/px-forms";
    @import "../components/px-buttons/less/px-buttons";
    ```

8. Update your `public/templates/layouts/master.dust` to remove the leading slashes for the css and js references.

    ```
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>{+title /}</title>
        <link rel="stylesheet" href="css/app.css" />
    </head>
    <body>
    <div id="wrapper" class="content">
        {+body /}
    </div>
    <script src="js/app.js"></script>
    </body>
    </html>
    ```

    Reload your browser to see the styled login form. That is way cooler than "Hello, index"! Unfortunately, that login form doesn't actually do anything at the moment. Let's change that.


## 4. Add login support, so you can decode cookies from the stage

1. Add services configuration value  to `config/development.json`:

    ```
    "services": {
        "servicecore": {
            "rejectUnauthorized" : false,
            "socketTimeout": 45000
        }
    }
    ```

2. Add the following configuration values to the middleware section of `config/development.json`:

    ```
    "session": {
        "module": {
            "name": "express-session"
        }
    },

    "servicecore": {
        "enabled": true,
        "priority": 104,
        "module": {
            "name": "servicecore"
        }
    },

    "encryptedcookies": {
        "enabled": true,
        "priority": 111,
        "module": {
            "name": "encryptedcookies-paypal",
            "arguments": [{
                "encryptionKey": "vault:encrypted_crypt_key",
                "macKey": "vault:encrypted_mac_key"
            }]
        }
    },

    "securitycontext": {
        "enabled": true,
        "priority": 112,
        "module": {
            "name": "securitycontext-paypal"
        }
    },

    "auth": {
        "enabled": true,
        "priority": 113,
        "module": {
            "name": "auth-paypal",
            "arguments": [{
                "cookieEncryptionKey": "vault:encrypted_crypt_key",
                "cookieMacKey": "vault:encrypted_mac_key"
            }]
        }
    }
    ```

3. Update `routes/index.js` with code to export a */login* POST method using ppauth:

    ```
    'use strict';

    var ppauth = require('auth-paypal'),
        indexController = require('../controllers/index'),
        loginRequired = ppauth.authorize({ failureRedirect: '/sampleapp/login/failure' });

    module.exports = function (router) {

        router.get('/', function (req, res) {
            var model = {
                requestURI: req.app.kraken.get('requestURI'),
                isLoggedIn: (req.securityContext && req.securityContext.actor.auth_state === 'LOGGEDIN')
            };

            res.render('index', model);
        });

        router.get('/login', function (req, res) {
            res.redirect(req.app.kraken.get('requestURI'));
        });

        router.post('/login', ppauth.login({
            successRedirect: '/sampleapp/index',
            failureRedirect: '/sampleapp/login/failure'
        }));

        router.get('/login/failure', function (req, res) {
            console.log('info', 'Incorrect login credentials entered by user.');
            res.redirect(req.app.kraken.get('requestURI'));
        });

        router.get('/logout', ppauth.logout(), function (req, res) {
            res.redirect(req.app.kraken.get('requestURI'));
        });

        router.get('/index', loginRequired, indexController.index);
    };
    ```

    Notice that the route contains `ppauth.authorize()`. This method will protect a route from unauthorized users.
    Now, if you reload your browser you should now be able to log in (if you don't have a test account use ppaas_default@paypal.com / 11111111). Upon successful login, you'll be redirected back to our welcome screen.

    If you experience an "AssertionError: hostname must be defined."  It can be helpful to remove your current project's node_modules directory and reinstall.  This addresses an issue that can occur when modules are manually installed out of order causing duplicate copies of the same modules to be in the node_modules directory.

    ```
    rm -rf node_modules
    npm install
    ```

## 5. Now that we can log in, lets access invoice data.  Add routes and a template for invoice activity

1. Update `routes/index.js` with code to export an */invoices* GET method and replace the post login:

    ```
    router.post('/login', ppauth.login({
        successRedirect: '/sampleapp/invoices',
        failureRedirect: '/sampleapp/login/failure'
    }));

    router.get('/invoices', loginRequired, function (req, res) {
            res.render('invoices/index', {});
    });
    ```

2. Create `public/templates/invoices/index.dust` with the following HTML:

    ```
    {>"layouts/master" /}

    {<body}
        <h2>Invoices</h2>
        {?invoices}
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Invoice No.</th>
                        <th>Status</th>
                        <th>Invoice Date</th>
                        <th>Amount</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {#invoices}
                        <tr>
                            <td>{number}</td>
                            <td>{status}</td>
                            <td>{invoice_date}</td>
                            <td>{total_amount.currency} {total_amount.value}</td>
                            <td>{note}</td>
                        </tr>
                    {/invoices}
                </tbody>
            </table>
        {:else}
            No records found.
        {/invoices}
    {/body}
    ```

3. Update your `public/css/app.less` file to add style for table elements:

    ```
    th {
      text-align: left;
    }
    .table {
      width: 100%;
      margin-bottom: @line-height-computed;
      // Cells
      > thead,
      > tbody,
      > tfoot {
        > tr {
          > th,
          > td {
            padding: @table-cell-padding;
            line-height: @line-height-base;
            vertical-align: top;
            border-top: 1px solid @table-border-color;
          }
        }
      }
    }
    .table-striped {
      > tbody > tr:nth-child(odd) {
        > td,
        > th {
          background-color: @table-bg-accent;
        }
      }
    }
    ```

    Reload the page and you should see an invoice page with no data. Now let's get the data from an API.

## 6. Hook up the Invoice service

1. The PPaaS servicecore client needs to be installed:

    ```
    npm install ppaas --save
    ```

2. Create `models/invoices.js`:

    In your model you will need to create a PPaaS servicecore client for the invoice service.

    ```
    'use strict';

    var servicecore = require('servicecore'),
        invoices = servicecore.create('ppaas', {
            service: 'invoicingserv',
            scopes: ['https://uri.paypal.com/services/invoicing/.*'] // optional, only include if the service does not work without it
        });

    function Invoices(req) {
        this.req = req;
    }

    Invoices.prototype = {

        list: function (options, callback) {

            options = options || {};

            // list invoices
            invoices.request({
                method: 'GET',
                path: '/v1/invoicing/invoices',
                qs: 'page=0&page_size=10'
            }, function (err, response) {
                callback(err, response.body);
            });
        }
    };

    module.exports = Invoices;
    ```

3. Create 'controllers/invoices.js':

    ```
    'use strict';

    var Invoices = require('../models/invoices.js');

    module.exports = {

        list: function (req, res, next) {
            var invoices = new Invoices(req),
                options = {};

            invoices.list(options, function (err, result) {
                var model = result;

                if (err) {
                    req.log('error', err.message);
                    next(err);
                    return;
                }

                model.isLoggedIn = req.securityContext.actor.auth_state === 'LOGGEDIN';
                model.requestURI = req.app.kraken.get('requestURI');

                res.render('invoices/index', model);
            });
        }
    };
    ```

4. Update `routes/index.js` with code to call the invoice controller:

    ```
    'use strict';

    var ppauth = require('auth-paypal'),
        indexController = require('../controllers/index'),
        invoicesController = require('../controllers/invoices'),
        loginRequired = ppauth.authorize({ failureRedirect: '/sampleapp/login/failure' });

    module.exports = function (router) {

        router.get('/', function (req, res) {
            var model = {
                requestURI: req.app.kraken.get('requestURI'),
                isLoggedIn: (req.securityContext && req.securityContext.actor.auth_state === 'LOGGEDIN')
            };

            res.render('index', model);
        });

        router.get('/login', function (req, res) {
            res.redirect(req.app.kraken.get('requestURI'));
        });

        router.post('/login', ppauth.login({
            successRedirect: '/sampleapp/invoices',
            failureRedirect: '/sampleapp/login/failure'
        }));

        router.get('/login/failure', function (req, res) {
            console.log('info', 'Incorrect login credentials entered by user.');
            res.redirect(req.app.kraken.get('requestURI'));
        });

        router.get('/logout', ppauth.logout(), function (req, res) {
            res.redirect(req.app.kraken.get('requestURI'));
        });

        router.get('/index', loginRequired, indexController.index);
        router.get('/invoices', loginRequired, invoicesController.list);
    };
    ```

    Reload the page and you should see an invoice page with data for the logged in user.  If there is no data for this user, you will not see any data.  Now you have completed the basic steps of creating a Kraken app that connects to a service.


## Optional

### Analytics Support

Install [analytics](https://github.paypal.com/NodeServices/node-analytics/tree/servicecore.next) for FPTI and SiteCatalyst support. Add any configuration values to `middleware:analytics` in `config/config.json`.

```
npm install --save analytics-paypal
```

### Experimentation Support

Install [experimentation](https://github.paypal.com/NodeServices/node-experimentation/tree/servicecore.next) for PxP support. Add any configuration values to `middleware:experimentation` to `config/config.json`.

```
npm install --save experimentation-paypal
```

### Device Detection Support

Install [wurfl](https://github.paypal.com/NodeServices/node-wurfl) for WURFL support. Add any configuration values to `middleware:wurfl` to `config/config.json`.

```
npm install --save wurfl-paypal
```

### Custom dust helpers and PayPal link building support

Install [dusthelpers-supplement](https://github.paypal.com/CoreUIE/dusthelpers-supplement.git).

```
npm install --save dusthelpers-supplement
npm install --save ppdustjs-filters-secure
```

Add the following to `config/config.json` to register the custom helper:

```
"view engines": {
    //[dust || js] depending on the view engine you are modifying
    "dust": {
        "module": "engine-munger",
        "renderer": {
            "method": "js",
            "arguments": [
                {"helpers": [ "dusthelpers-supplement" ] }
            ]
        }
    }
}
```


Now that we can build image urls, update `public/templates/inc/master.dust by replacing the image element with the following:

```
<h1><img src="{@link href="i/sparta/logo/logo_paypal_106x29.png"/}" alt="PayPal logo"></h1>
```

## Builds

[Grunt](http://gruntjs.com/), the JavaScript task runner, is used for builds.

To Install the Grunt CLI

```
npm install -g grunt-cli
```

To execute the jshint, mocha unit test etc

```
grunt test
```

To run the Istanbul code coverage task

```
grunt coverage`
```

To prepare your code for production. This task performs the less, dust.js, and require.js precompiling and creates new files in the `.build` directory.  This task must be done before running your app in production mode.

```
grunt build
```

