'use strict';

/**
 * Module dependencies.
 */
var staff = require('../../app/controllers/staff.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/staff')
		.get(staff.index);
};