## Migration from Kraken 1.0 to the new content system

Install the new makara module:

```
npm install --save makara@2
```

or put it in package.json

```
"makara": "^2.0.0",
```

[makara](https://github.com/krakenjs/makara) has is split into multiple smaller modules doing their own unique smaller tasks. It's now an umbrella module with Kraken-shaped defaults for the content system.

Check out README.md of following modules for more information:

* [makara](https://github.com/krakenjs/makara#readme)
* [dust-makara-helpers](https://github.com/krakenjs/dust-makara-helpers#readme)
* [grunt-makara-amdify](https://github.com/krakenjs/grunt-makara-amdify#readme)
* [grunt-makara-browserify](https://github.com/krakenjs/grunt-makara-browserify#readme)
* [spundle](https://github.com/krakenjs/spundle#readme)

#### Express options in your config

The view engine is simplified: choose `js` (dust templates compiled at build time) or `dust` (dust templates compiled on the fly and cached in process)

```
    "express": {
        "view engine": "js",
        "views": "path:./.build/templates"
    }
```

and in development:

```
    "express": {
        "view engine": "dust",
        "views": "path:./public/templates"
    }
```

#### View engines

```
    "view engines": {
        "dust": {
            "module": "makara",
            "renderer": {
                "method": "dust",
                "arguments": [ {
                    "cache": true, /* set to false for development */
                    "helpers": "config:dust.helpers"
                } ]
            }
        },

        "js": {
            "module": "makara",
            "renderer": {
                "method": "js",
                "arguments": [ {
                    "cache": true,
                    "helpers": "config:dust.helpers"
                } ]
            }
        }
    },

    "dust": {
        "helpers": [
            "ppdustjs-filters-secure",
            "dustjs-helpers",
            {
                "name": "dust-makara-helpers",
                "arguments": {
                    "autoloadTemplateContent": false
                }
            }
        ]
    },
```

The `js` engine is no longer faster than the `dust` engine, as the dust engine now caches its content properly and doesn't need to invalidate the cache to serve a new language.

This configuration will share the `dust.helpers` between the two engine instances, and in this case, `dust-makara-helpers` is set to _not_ auto-load content based on the name of your template. If you want the old behavior of one properties file per template, flip that boolean. However, you will have to make sure that _all_ of your templates have a properties file to go with them. This way nothing gets missed, because missing files are actually errors. To take advantage of the lack of autoloading, add `{@useContent bundle="file.properties"}` blocks around your localized content, to make sure that the messages you need are loaded into the dust context.
