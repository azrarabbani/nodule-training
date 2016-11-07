/*
 * Configure require, launch mocha unit tests
 *
 */ 
(function (module) {
	"use strict";

	if (typeof window !== "undefined" && navigator && document) {
		require.config({
			paths: {
				"projectMain": "app"
			}
		});
		require.config({
			baseUrl: "../../../public/js"
		});
		require(["projectMain"], function (projectMain) {
			//projectMain will bring in the project's require settings
			//apply mocha specific additions to require config
			require.config({
				paths: {
					"chai": "../../test/browser/runner/lib/chai",
					"mocha": "../../test/browser/runner/lib/mocha",
					"specs": "../../test/browser/specs",
					"specDir": "../../test/browser/spec",
					"dust": "../../test/browser/runner/lib/dust-full-1.1.1",
					"util": "../../test/browser/util",
					"tmpl": "../../test/browser/template",
					"model": "../../test/browser/model",
					"text": "../../test/browser/util/text"
				},
				shim: {
					"mocha": {
						exports: "mocha"
					},
					"dust": {
						exports: "dust"
					}
				}
			});
			//dependencies for running mocha tests
			require(['require', 'chai', 'mocha', 'specs'], function (require, chai, mocha, specs) {
				var should = chai.should(),
					single = location.href.split("single=");
				mocha.setup('bdd');
				//add ?single=test-name in order to run a single test
				if (single.length === 2) {
					specs = ["../../test/browser/spec/" + single[1]];
				}
				require(specs, function () {
					if (window.mochaPhantomJS) {
						window.mochaPhantomJS.run();
					} else {
						window.mocha.run();
					}
				});
			});
		});

	}

	/*global module:true*/
}(typeof module === "undefined" ? {} : module)); /*global module:false*/