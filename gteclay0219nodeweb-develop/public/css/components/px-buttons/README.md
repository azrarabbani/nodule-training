#  px-buttons
=============

##Requirements:
See `bower.json`'s dependencies

##Steps to install in your project:

To retrieve the component code and have it placed into your project:

    bower install px-buttons

To reference the component LESS code and have it used by your project:

```less
@ROOT: "../components";
@import "@{ROOT}/px-base/less/px-base";
@import "@{ROOT}/px-buttons/less/px-buttons";
```

##Steps to build example code:

1. `git clone` the repo: gets all the code from github.paypal.com.
2. `npm install`: installs the grunt plugins needed for building the example code.
3. `bower install`: installs the UI component dependencies.
4. `grunt build`: builds the example dust file into a page you can see.
5. Open examples/index.html in a browser

To run a server with the example code for testing on mobile or other platforms, run these steps on the command line and navigate to `http://localhost:8080`:

    cd examples
    python -m SimpleHTTPServer 8080

## Issues

For issues, feedback, etc. please submit a pull request or github [issue](https://github.paypal.com/UIE-Components/px-footer-generic/issues) or you can always contact the [UIE-Components](mailto:DL-PayPal-UIE-Components@paypalcorp.com) DL.

## Changelog
- 0.1.0 Establish the component as an extension of Bootstrap v3.0.3 buttons CSS.
