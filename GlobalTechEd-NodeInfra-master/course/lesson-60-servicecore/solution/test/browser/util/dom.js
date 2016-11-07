/* global define, dust */
/**
 * dom.js - convenience methods for unit testing
 *
 * @author Matt Edelman <medelman@paypal.com>
 */
define(["jquery"], function ($) {

	"use strict";


	var DOMUtility = function () {

	};


	DOMUtility.prototype = {
		$harnessContainer: null,
		/**
		 * do any initialization
		 */
		init: function () {
			//nothing yet
		},
		/**
		 * set the jquery object where we should put all harness HTML
		 * @param $elem jQuery object reference
		 */
		setHarnessContainer: function ($elem) {
			this.$harnessContainer = $elem;
		},
		/**
		 * populate the harness element with HTML
		 * @param html string to add into harness
		 */
		setHarness: function (html) {
			//make sure harness container is set
			if (this.$harnessContainer === null) {
				this.setHarnessContainer(($("#harness").length > 0) ? $("#harness") : $("body"));
			}
			this.cleanHarness();
			this.$harnessContainer.html(html);
		},
		/**
		 * remove html from harness element
		 */
		cleanHarness: function () {
			this.$harnessContainer.html("");
		},
		/**
		 * return a rendered dust template as a string
		 * @param  config {tmplId: "mapstorawtemplate",dustId: "mapstodustregistry",returnObj: {str: "str is only property"}}
		 */
		render: function (config) {
			//if exists in dust registry, return existing
			if (dust.cache[config.dustId] === undefined) {
				//dust.compile($(config.tmplId).text(), config.dustId);
				dust.loadSource(dust.compile($(config.tmplId).text(), config.dustId));
			}
			dust.render(config.dustId, {}, function (err, out) {
				config.returnObj.str = out;
			});
		}
	};
	return new DOMUtility();
});