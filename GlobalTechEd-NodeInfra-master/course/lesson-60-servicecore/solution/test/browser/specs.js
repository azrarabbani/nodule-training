/* global define */
define(function () {
	"use strict";
	//array of unit tests
	var suite = [];

	suite.push('../../test/browser/spec/test-test');
	//below can be uncommented when jquery dependency is available in project
	//suite.push('../../test/browser/spec/test-dom');
	return suite;
});