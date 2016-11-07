# Sample PayPal Node.js App

If you simply want to clone the repo and play, you can run do so with:

```bash
$ git clone git://github.paypal.com/nodejs/sample-app.git
$ cd sample-app
$ npm install
$ node .
```

If, however, you came here to learn, then you should follow the tutorial below to build a PayPal application.


## 1. Initial setup
First thing, Configuring hosts file:

1. For Mac:

    Step 1: cd /private/etc

    Step 2: sudo vim or nano hosts

    Step 3: If file already has `127.0.0.1 localhost`, add an alias like so: `127.0.0.1 localhost localhost.paypal.com`. Otherwise include: `127.0.0.1     localhost.paypal.com`
2. For Windows:

    Step 1: Go to `C:\Windows\System32\drivers\etc`

    Step 2: Open hosts in notepad or any text editor as an administrator

    Step 3: Same as Step 3 for Mac


Let's make sure node.js is working properly:

1. [Set up your node.js environment](https://github.paypal.com/nodejs/getting-started/blob/master/README.md)
2. [Create a kraken application](http://krakenjs.com/#gettingstarted)
3. [See your application running](http://localhost.paypal.com:8000/sampleapp)

If your application says "Hello, world" congratulations, you can proceed to step 2.

## 2. Now let's configure your app for PayPal

You just created a vanilla kraken app, but now we want to add support for PayPal's infrastructure. Luckily, [brogan](https://github.paypal.com/NodeInfra/brogan) makes this easy for you. Run the following command in your terminal to install it and the other required PayPal dependencies:

    npm install --save auth-paypal
    npm install --save brogan-paypal
    npm install --save cal
    npm install --save commons-paypal
    npm install --save connect-mayfly
    npm install --save continuation-local-storage
    npm install --save encryptedcookies-paypal
    npm install --save express-meta
    npm install --save express-session
    npm install --save keebler-paypal
    npm install --save locale
    npm install --save monitor-paypal
    npm install --save nconf
    npm install --save passport
    npm install --save pplogger
    npm install --save securitycontext-paypal
    npm install --save servicecore
    npm install --save topos

That should take a minute or two, but once it's done you'll want to update your application per the [brogan README](https://github.paypal.com/NodeInfra/brogan#api).


### Middleware order

Middleware order in `config/config.json` is important.
Make sure you use the following order of priorities for these Infra modules
 - cal - usually 90 (sets the request correlationId and init's CAL request context)
 - commons-paypal (rlogId, isInternalRequest, debugInfo etc..)
 - expressMeta (provides ECV check and /meta)
 - pplogger (starts the request transaction(t-T) for CAL)
 - session - usually 100
 - servicecore - usually 100 (initializes the servicecore request binding for all the services)
 - keebler (cookieserv)
 - device-detection-paypal (for device Info - browser, device etc..)
 - analytics


### Logging
Logging in production is through CAL, but this is abstracted with [pplogger](https://github.paypal.com/NodeInfra/pplogger#api). Add the following configuration value to `config/development.json` to enable console logging in development:

    "logger": {
        "type": "console",
        "format": "console",
        "level": "debug"
    }

Add the following to the `config/config.json` to enable `cal` logging in stage and live environments.

    "logger": {
        "type": "cal"
    }

### Service Connectivity
Service discovery is done with [topos](https://github.paypal.com/NodeInfra/node-topos#node-topos). Add the following configuration value to `config/development.json` to tell your application to use services on a given stage:

    "topos": {
        "host": "msmaster.qa.paypal.com"
    }

This value should be updated to use your team's stage.

### Sessions
Sessions are done with [mayfly](https://github.paypal.com/NodeInfra/connect-mayfly#connect-mayfly). Add the following configuration value to `config/config.json`:

    "session": {
        "enabled": true,
        "priority": 100,
        "module": {
            "name": "connect-mayfly/middleware",
            "arguments": [{
                "cryptKey": "vault:encrypted_mayflysession_crypt_key",
                "macKey": "vault:encrypted_mayflysession_mac_key",
                "cookie": {
                    "path": "/",
                    "httpOnly": true,
                    "maxAge": null
                },
                "proxy": null
            }]
        }
    }

### Express mount point

Add the `requestURI` to `config/config.json`

         "requestURI": "/sampleapp"

The kraken app routes can be organized in multiple ways for a mount point.
One sample shown here is to create a routes directory in your app and the directory structure will be a simulation of the routing path.
So creating a sampleapp folder under routes and putting all the subroutes under routes/sampleapp/index.js will mount those routes onto '/sampleapp'.
Also set the `routes` middleware in `config/config.json` to

        "router": {
            "module": {
                "arguments": [{
                    "directory": "path:./routes"
                }]
            }
        }

Route registration is highly customizable. If you're interested in trying a different behavior, be sure to check out the module that takes care of it in kraken: [express-enrouten](https://github.com/krakenjs/express-enrouten).
Let's start your application back up with `node index.js`. It should successfully start back up again, accessible by http://localhost:8000/sampleapp, this time writing a bit of extra information to the console front MayFly and locale. Your app still doesn't do anything awesome yet, so let's move on to the next step.

## 3. Adding HTML and CSS

"Hello, world" is boring and too simple. Let's improve upon that.

1. Open `public/templates/index.dust` and update the HTML to contain the following using [Dust.js](http://linkedin.github.io/dustjs/):

        {>"layouts/master" /}

        {<body}
            <h1>Log In</h1>
            <a class="btn btn-primary" href='{redirectUrl}'>
                {@pre type="content" key="buttons.login" /}
            </a>
        {/body}


2. Next, we'll use *bower* to install two of our CSS libraries. From the terminal run:

        bower install px-forms
        bower install px-buttons

3. Import the LESS files from the previous step into your `public/css/app.less` file:

        @import "../components/px-base/less/px-base";
        @import "../components/px-forms/less/px-forms";
        @import "../components/px-buttons/less/px-buttons";


Reload your browser to see the styled login form. That is way cooler than "Hello, world"! Unfortunately, that login form doesn't actually do anything at the moment. Let's change that.


## 4. Adding a login controller

1. Install the unified login module:
        npm install --save node-unified-login-url

2. Add the following to `config/development.json` so you can decode cookies from the stage:

        "session": {
            "module": {
                "name": "express-session"
            }
        },

        "services": {
            "servicecore": {
                "rejectUnauthorized": false
            }
        }

3. Create `routes/index.js` with code to load the index page:

        'use strict';
        var unifiedLoginUrl = require('node-unified-login-url');

        module.exports = function (router) {
            router.get('/', function (req, res) {
                var requestURI = req.app.kraken.get('requestURI'),
                    accountPage = 'account';

                var model = {
                    accountPage: accountPage,
                    isLoggedIn: (req.securityContext && req.securityContext.actor.auth_state === 'LOGGEDIN'),
                    redirectUrl: unifiedLoginUrl.getLoginUrl(req, {returnUri: req.protocol + '://' + req.headers.host + requestURI + '/' + accountPage}),
                    requestURI: requestURI
                };
                res.render('index', model);
            });
        };


The index page has a button which is linked to Unified Login. This is where you enter credentials to login. (if you don't have a test account use buttonmill@paypal.com / 45454545. For more details see section '[Logging in through Unified Login](#logging-in-through-unified-login)'). Upon successful login, you'll be redirected to */account*. Let's create that now.

## 5. Adding routes, and template for account activity

1. Create `routes/sampleapp/index.js` with code to export an */account* GET method

        'use strict';

        var ppauth = require('auth-paypal');

        module.exports = function (router) {
            router.get('/account', ppauth.authorize({
                failureRedirect: '/sampleapp/login/failure'
            }), function (req, res) {
                res.render('account', {});
            });
        };

 Notice that the route contains `ppauth.authorize()`. This method will protect a route from unauthorized users.

2. Create `public/templates/account.dust` with the following HTML:

        {>"layouts/master" /}

        {<body}
            <h1>Welcome {name}</h1>
            <h2>Balance: {balance}</h2>
            <h2>My recent activity</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Fee</th>
                        <th>Gross</th>
                    </tr>
                </thead>
                {#activity}
                    <tbody>
                        <tr>
                            <td class="text-right">{date}</td>
                            <td>{type}</td>
                            <td>{name}</td>
                            <td>{status}</td>
                            <td class="text-right">{fee}</td>
                            <td class="text-right">{gross}</td>
                        </tr>
                    </tbody>
                {/activity}
            </table>
        {/body}


Reload the page and you should see an account page with no data. Let's now get the data from an API.

## 6. Hook up the services

The account page uses several different services to collect data about the user.

1. Using the terminal, the service wrappers for [walletactivitysearch](https://github.paypal.com/NodeServices/node-activityservice/tree/servicecore.next), [userread](https://github.paypal.com/NodeServices/node-userread/tree/servicecore.next),  [walletfiservice](https://github.paypal.com/NodeServices/node-walletfiservice/tree/servicecore.next), [userrelationship-paypal](https://github.paypal.com/NodeServices/node-userrelationship), and [ffxfx-paypal](https://github.paypal.com/NodeServices/node-ffxfx)

        npm install --save walletactivitysearch-paypal userread-paypal walletfi-paypal userrelationship-paypal ffx-paypal

2. We're also going to use [async](https://github.com/caolan/async) to manage calling the services in parallel

        npm install  --save async

3. Add a controller for the route in `/sampleapp/account` in `controller/account.js` to call the services on behalf of the user

Refer **controllers/account.js**

This will now call the services in parallel and render the page once the last one has finished, but we need to pretty up the `result` before passing it to our render method.

## 7. Use a model to form the page's data

1. Create `models/account.js`
2. Export a method which aggregates the three data sources and formats them correctly for the user. See [models/account.js](https://github.paypal.com/nodejs/sample-app/raw/master/models/account.js) for the example code.

   Note: [griffin](https://github.paypal.com/Globalization-R/griffin-node) is available for locale specific formatting for currency, date, number, address, phone number, name, and other metadata.

3. Update our route in `controllers/account.js` to use this model to format the data

        var accountModel = require('../models/account');

        // ...

        function (err, result) {
            var model = accountModel.create(result.user, result.wallet, result.activity);
            res.render('account', model);
        }

4. Create other models as in the `models` directory

## 5. Performance monitoring
The `monitor-paypal` module sends a large number of metrics about your application to Sherlock (http://sherlock). You don't need to do anything special for this to happen. Details on the various metrics are in the [monitor-paypal README](https://github.paypal.com/NodeInfra/monitor-paypal).

## Optional

### Analytics Support

Install [analytics](https://github.paypal.com/NodeServices/node-analytics/tree/servicecore.next) for FPTI and SiteCatalyst support. Add any configuration values to `middleware:analytics` in `config/config.json`.

    npm install --save analytics-paypal

### Experimentation Support

Install [experimentation](https://github.paypal.com/NodeServices/node-experimentation/tree/servicecore.next) for PxP support. Add any configuration values to `middleware:experimentation` to `config/config.json`.

    npm install --save experimentation-paypal

### Device Detection Support

Install [device-detection-paypal](https://github.paypal.com/nodeinfra/device-detection-paypal) for determining device information. Full details on the API are in the README.

    npm install --save device-detection-paypal

### Custom dust helpers and PayPal link building support

Install [dusthelpers-supplement](https://github.paypal.com/CoreUIE/dusthelpers-supplement.git).

    npm install --save dusthelpers-supplement
    npm install --save ppdustjs-filters-secure

Add the following to `config/config.json` to register the custom helper:

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


Now that we can build image urls, update `public/templates/inc/master.dust by replacing the image element with the following:

    <h1><img src="{@link href="i/sparta/logo/logo_paypal_106x29.png"/}" alt="PayPal logo"></h1>

## Adding your own middleware

If you have custom middleware, you will want to add it to the config/config.json file. Middleware is setup using configuration and a kraken module named `meddleware` takes the config and registers middleware for you. For full details, see: https://github.com/krakenjs/meddleware#meddleware

Note that the priority value controls the order the middleware is run in the pipeline. Be careful that you don't assign your middleware a priority higher than the router or it will nt be used. Currently, the router priority is 120.

## Error handling

By default, the sample app uses Express's built-in error handling middleware. We have a stub in `lib/errorHandler.js` that can be fleshed out if you wish to override this.

If a handler throws an exception or calls its `next` argument with an error, further middleware will be skipped until one reaches error handling middleware.

## Logging in through Unified Login

All PayPal applications requiring a login should be done through Unified Login. In the section 'Adding a Login Controller', we are creating a parameter called redirectUrl in the model. This is used in the index page as a link to redirect to Unified Login. The url is generated by the function loginUrl which is returned by the [node module](https://github.paypal.com/rravikumar/node-unified-login-url). This has more details on how this function works and how to use Unified Login in general.

If you are deploying this application on Altus stages, redirection to Unified Login is automatically recognized and the credentials used will be recognized across all these stages. However, if you are deploying this application in stage2 environments, Unified Login and the all the services it is dependent upon will have to be deployed in this particular stage. More details are available [here](https://confluence.paypal.com/cnfl/display/UnifiedLogin/Stage+Deployment+Instructions)

Note: When logging in through localhost, Unified Login unsets the cookie secure flag. But, when you login to Unified Login directly on stage the cookie secure flag is set. So, while you may be logged in on stage, it doesn't mean that you will be logged in to the sampleapp running on localhost.

## Builds

[Grunt](http://gruntjs.com/), the JavaScript task runner, is used for builds.

To Install the Grunt CLI
`npm install -g grunt-cli`

`grunt test`
    To execute the jshint, mocha unit test etc

`grunt coverage`
    To run the Istanbul code coverage task

`grunt build`
    To prepare your code for production. This task performs the less, dust.js, and require.js precompiling and creates new files in the `.build` directory.
    This task must be done before running your app in production mode.

