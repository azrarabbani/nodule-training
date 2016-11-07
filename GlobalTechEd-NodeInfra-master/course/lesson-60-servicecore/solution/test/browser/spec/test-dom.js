/* global describe, before, after, it, define */
define(['util/dustRender!tmpl/profile.dust:model/profile', 'model/profile', 'jquery', 'util/dom'], function (profileTemplate, profileModel, $, domUtil) {
	"use strict";
	/**
	 * Verify that retrieve method gets the user's name from the markup
	 */
	describe('profile template', function () {
		before(function (done) {
			domUtil.setHarness(profileTemplate);
			done();
		});
		after(function (done) {
			domUtil.cleanHarness();
			done();
		});
		it('should have the data from profile model', function (done) {
			if ($("span#user").text() === profileModel.data.name) {
				done();
			} else {
				console.log($("span#user").text());
				done(new Error("User name not present"));
			}
		});
	});
});