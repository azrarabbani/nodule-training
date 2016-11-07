px-grids
==============

This is bower component based on bootstrap grid component. This component allows you to implement designs based on bootstrap grids to create responsive experiences. The values for the gutters, margins, column widths and breakpoints can be found in variables.less file of the px-base component.

##Requirements:
(See `bower.json`'s dependencies)
- px-base component

##Steps to install in your project:

1. Install via bower

	```
	  bower install px-grids
	```

	This creates a "px-grids" folder under your public/components/ folder.


2. Import `px-grids.less` into your app.less on your application like so

	```
	// Bower Components
	@import 'public/components/px-grids/less/px-grids.less';
	```

##Reference for working with grids

Since this is a bower component of the bootstrap grids, the underlying architecture is untouched even if we update the variables. So, please refer to [Bootstrap documentation](http://getbootstrap.com/css/#grid) for more information on how to use px-grids in your application.

## Issues

For issues, feedback, etc. please submit a pull request or github [issue](https://github.paypal.com/UIE-Components/px-grids/issues) or you can always contact the [UIE-Components](mailto:DL-PayPal-UIE-Components@paypalcorp.com) dl.

## Changelog
 - 0.0.1 Initial version of px-grids
 - 0.0.2 Adding in a px-grids.css file for public consumption along with px-grids.less
