/* global define, dust, parentRequire */
// dustRender.js plugin for requirejs / text.js
// load/compile/render dust templates with or without a data model
define(['dust'],

function (dust) {
	"use strict";
	var loadResource = function (resourceName, parentRequire, callback, config) {
		var resourceArray = resourceName.split(":");
		if (resourceArray.length === 1) {
			//no data model provided
			parentRequire([("text!" + resourceArray[0])], function (rawTemplate) {
				if (dust.cache[resourceName] === undefined) {
					dust.loadSource(dust.compile(rawTemplate, resourceName));
				}
				dust.render(resourceName, {}, function (err, out) {
					callback(out);
				});
			});
		} else {
			//data model provided
			parentRequire([("text!" + resourceArray[0]), resourceArray[1]], function (rawTemplate, dataModel) {
				if (dust.cache[resourceName] === undefined) {
					dust.loadSource(dust.compile(rawTemplate, resourceName));
				}
				dust.render(resourceName, dataModel, function (err, out) {
					callback(out);
				});
			});
		}

	};

	return {
		load: loadResource
	};

});