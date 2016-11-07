px-footer-generic
=================

This is a generic footer component that has slots for different products to add their footer content.

##Requirements:
See `bower.json`'s dependencies

##Steps to install in your project:
This component is meant to be used with a wrapper component, such as px-footer-consumer. Typically, the steps to install this component into your project will be to run:

    bower install px-footer-consumer

However, if you have a need to define your own footer links and actions, you can install this component directly by running:

    bower install px-footer-generic

### Your application must provide support for the footer in your global styles

The footer is at the bottom of the page. When the content is not log enough to cause vertical scrolling, the footer shows below white space, otherwise the user must scroll down to the end of the content to see the footer. The method of achieving this behavior is used from [this article](http://matthewjamestaylor.com/blog/keeping-footers-at-the-bottom-of-the-page), and requires some support in styles on selectors that are outside the scope of this component.

```css
// html and body selectors need height: 100% rule so the footer can show at the
// bottom of the screen beneath whitespace if content is not long enough to cause
// vertical scrolling
html,
body {
    height: 100%;
}

// this container includes the header, main content, and footer
// it needs position:relative so the footer can use position:absolute
.my-main-container {
    min-height: 100%;
    position: relative;
}

// this container includes the main content
// it needs top and bottom padding so content doesn't show below the header or footer
.my-main-content {
    padding-top: 5em;
    padding-bottom: 5em;
}
```

##Steps to build example code:

1. `git clone` the repo: gets all the code from github.paypal.com.
2. `npm install`: installs the grunt plugins needed for building the example code.
3. `bower install`: installs the UI component dependencies.
4. `grunt build`: builds the example dust file into a page you can see.
5. Open examples/index.html in a browser: makes you happy.

Steps 2 and 4 are optional for anyone who just wants to look at the example
file.  the built examples/index.html file is included as part of the repo. The
base-css dependency is not included as part of this repo, which is why step 3
is required.

To run a server with the example code for testing on mobile or other platforms:

    cd examples
    python -m SimpleHTTPServer [port]

## Issues

For issues, feedback, etc. please submit a pull request or github [issue](https://github.paypal.com/UIE-Components/px-footer-generic/issues) or you can always contact the [UIE-Components](mailto:DL-PayPal-UIE-Components@corp.ebay.com) DL.

## Changelog
- 0.0.1 Initial code
