
## Kraken 1.0

* **Express 4.0 upgrade** Kraken 1.0 works alongside express 4.0, so please read express 4.0 migration docs to understand [express app specific changes](https://github.com/visionmedia/express/wiki/Migrating-from-3.x-to-4.x)
* **Latest kraken generator** To inspect a generated scaffolded kraken 1.0 app using generator-kraken, get the latest from npm `$ npm install -g generator-kraken@latest`
* **Supporting modules** All modules that are being used alongside kraken 1.0 can be found [here](http://github.com/krakenjs)
* **kraken website** This is the same as before. You can read all about kraken [here](http://krakenjs.com)

## Migration from <1.0 versions to 1.0
#### ** Package.json dependency ** Update your dependencies for kraken1.0
```
"kraken-js": "^1.0.1",
"kraken-devtools": "^1.0.0",
"express": "^4.3.0"
```
#### If you are using dust as your templating engine, and you would like to add the i18n and specialization support in your express app, you want to add the following dependencies as well.

```
"engine-munger": "^0.2.0",
"localizr": "^0.1.0"

```

[Makara](https://github.com/krakenjs/makara) (for kraken 0.7 and lesser) has now been split into multiple smaller modules doing their own unique smaller tasks.

Checkout readme.md of following modules for more information:

* [localizr](https://github.com/krakenjs/localizr)
* [grunt-localizr](https://github.com/krakenjs/grunt-localizr)
* [bundalo](https://github.com/krakenjs/bundalo)
* [file-resolver](https://github.com/krakenjs/file-resolver)
* [engine-munger](https://github.com/krakenjs/engine-munger)


#### ** App Configs**
App configs have been cleaned up to be more straightforward now.

Before:

```
config/app.json
config/app-development.json
config/middleware.json
config/middleware-development.json
```

`app.json` used to have the default app configs and `middleware.json` was used to specify the middleware specific configs. In order to override for specific `<env>` you were required to add `app-<env>.json` or `middleware-<env>.json` previously.

Now:

```
config/config.json
config/development.json
```
`config.json` is the default configs for your app and for any specific env overrides, add a `<env>.json`.

Please check out [kraken docs](https://github.com/krakenjs/kraken-js) for more details.

#### Adding kraken to your express app

Kraken previously used to internally create the express app and set it up with your custom configs and middleware chain.
But now the express app itself is created by you and kraken generates a middleware inserted into your express app which will do the custom config setup and middleware insertion in the priority order specified by you.

Before:

```
var kraken = require("kraken-js");
var app = {
	requestBeforeRoute: function (server) {

	},

	requestAfterRoute: function (server) {
	}

});

kraken.create(app).listen(function (err) {
	if (err) {
		console.error(err);
	}
});

```

Now:

```
var kraken = require('kraken-js'),
    app = require('express')(),
    port = process.env.PORT || 8000,
    options = {
        onconfig: function (config, next) {
            next(null, config);
        }
    };


app.use(kraken(options));

app.listen(port, function (err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});

```

The equivalent of `requestBeforeRoute` and `requestAfterRoute` options can be achieved in a more deterministic way now by adding a middleware with a specific priority in your middleware chain. We will discuss this in the next section.
Or you could also listen to specific middleware setup events to do your setup afterward. For example:

```
app.on('middleware:before:session', function (eventargs) {
    console.log(eventargs.config.name); // 'session'
});
```

Checkout [meddleware](https://github.com/krakenjs/meddleware) for more details.

#### Middleware

You can add middleware into your `config/config.json` or `config/<env>.json` as follows:

```
"middleware": {

        "devtools": {
            "enabled": true,
            "priority": 35,
            "module": {
                "name": "kraken-devtools",
                "arguments": [
                    "path:./public",
                    "path:./.build",
                    ...
                ]
            }
        }
```

What the above spec means is, devtools middleware will be inserted with priority 35 in your express app middleware chain.
The module named `kraken-devtools` will be used to get the middleware function and it will be passed the `arguments` array as in the spec.
Kraken uses [meddleware](https://github.com/krakenjs/meddleware) to do configuration-based middleware registration for express.
The middleware in the config is sorted (lower number first) based on the `priority` to decide the order in which they get inserted.
Please be sure to read [meddleware](https://github.com/krakenjs/meddleware) docs to understand different options.

#### Routes

With express 4.0, there is improved and better ways for routes specification!
You can specify your routes directly in `routes.js` under your app or may want to organize them better with a directory structure.
You can specify the path to your routes in the middleware config as follows:

```
"router": {
    "module": {
        "arguments": [{ "index": "path:./routes" }]
    }
}

(or)

"router": {
    "module": {
        "arguments": [{ "directory": "path:./routes" }]
    }
}

```

To learn more about routing options, checkout [express-enrouten](https://github.com/krakenjs/express-enrouten)

#### Express options in your config

You can specify options for your express app in your configs as follows. Most of it is the same as pre kraken-1.0.
Previously you could specify a rootURI for your app by specifying `route` property for your express app.
With express 4.0, it changed to `mountpath`.

```
"express": {
    "view engine": "js",
    "view cache": true,
    "views": "path:./.build/templates",
    "mountpath": "foo"
}

```

#### View engines

You can specify the view engines in kraken1.0 app config as follows:

```
"view engines": {
    "html": {
        "module": "consolidate",
        "renderer": {
            "method": "swig"
        }
    }
}

```

The above config will translate to follows while kraken sets up your app's view engine internally:

```
app.engine('html', consolidate.swig);

```

#### New shortstop handlers

Kraken 1.0 uses the module [confit](https://github.com/krakenjs/confit) to customize your app with your configs.
It has support for a couple of new shortstop protocols namely `import` and `config`.

* **import** : Merge the contents of the specified file into configuration under a given key.

```
{
    "middleware": "import:./middleware.json"
}
```

* **config** : Replace with the value at a given key. Note that the keys in this case are dot (.) delimited.

````
{
    "foo": {
        "bar": true
    },
    "foobar": "config:foo.bar"
}
```

Read more about [shortstop](https://github.com/krakenjs/shortstop).
Read more about available [shortstop protocols](https://github.com/krakenjs/shortstop-handlers).


## Paypal Specific Migration details
* **Brogan**
The way to include brogan in the workflow has changed.

BEFORE:

```
var app = brogan.decorate({

    configure: function (config, callback) {
        // ...
        callback();
    },

    requestStart: function (server) {
        // ...
    },

    requestBeforeRoute: function (server) {
        // ...
    },

    requestAfterRoute: function (server) {
        // ...
    }

});


kraken.create(baseURI, app).listen(function (err) {
    if (err) {
        console.error(err);
    }
});
```

NOW:

```
app.use(kraken({
    onconfig: brogan(function(config, next) {
        next(null, config);
    })
}));
```

*PLEASE NOTE: Brogan is being cleaned up further and there may be small changes in the interface. But as it stands, above is the way to use brogan.*


* **Middleware** Lot of the magic inside of brogan has been moved out into the app config itself and now gives more control to the app as to what aspects of paypal specific things it requires.
    Middleware that can be added in `config/config.json` are shown below:

```
{
    "middleware" : {
        // Add PayPal middleware after static
        "ppcommons": {
            "enabled": true,
            "priority": 41,
            "module": {
                "name": "commons-paypal"
            }
        },

        "servicecore": {
            "enabled": true,
            "priority": 43,
            "module": {
                "name": "servicecore"
            }
        },

        "pplogger": {
            "enabled": true,
            "priority": 42,
            "module": {
                "name": "pplogger",
                "arguments": [{
                    "type": "cal"
                }]
            }
        },

        // Add PayPal middleware before the router

        "auth": {
            "enabled": true,
            "priority": 112,
            "module": {
                "name": "auth-paypal"
            }
        },

        "decorators": {
            "priority": 115,
            "parallel": {
                "wurfl": {
                    "enabled": true,
                    "module": {
                        "name": "wurfl-paypal",
                        "arguments": [{ "capabilities": ["is_wireless_device", "is_tablet"] }]
                    }
                },

                "experiementation": {
                    "enabled": true,
                    "module": "experimentation-paypal"
                },

                "analytics-paypal": {
                    "enabled": true,
                    "module": {
                        "name": "analytics-paypal"
                    }
                },

                "locale": {
                    "enabled": true,
                    "module": {
                        "name": "locale"
                    }
                }
            }
        }

    }
}

```

Middleware that can be added to override logging in cal and overriding mayfly sessions for dev mode can be done in `config/development.json` as follows:

```
{
    "middleware": {
        // Override logger options
        "pplogger": {
            "module": {
                "arguments": [{
                    "type": "console",
                    "format": "pretty"
                }]
            }
        },

        // Override the session type

        "session": {
            "module": {
                "name": "express-session"
            }
        }
    }
}

```

## Services related
* **New Modules** Wrapper names have changed and needs to be updated per [this document](https://confluence.paypal.com/cnfl/display/nodejs/Node.js+-+Modules+compatible+with+servicecore+1.0.0).
* **Profiling** Profiling will automatically be done by servicecore and does not require apps to explicitly do `serviceWrapper.profile(req).serviceCall()` like before.
* **Params to ASF requests** Camel cased param key names will now change to be delimited by an `_`. eg. `accountId` becomes `account_id` You can check for the payload and response samples with latest service versions [here](https://www.stage2dev002.qa.paypal.com/wrapgen)
