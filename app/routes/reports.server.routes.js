'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var reports = require('../../app/controllers/reports.server.controller');

	// Reports Routes
	app.route('/reports')
		.all(users.requiresLogin, reports.all);

	app.route('/reports/categories')
		.all(users.requiresLogin, reports.categories);

	app.route('/reports/books')
		.all(users.requiresLogin, reports.books);

	app.route('/reports/loan_out_of_date')
		.all(users.requiresLogin, reports.loanOutOfDate);

	app.route('/reports/publishers')
		.all(users.requiresLogin, reports.publishers);

	app.route('/reports/loans')
		.all(users.requiresLogin, reports.loans);

	app.route('/reports/authors')
		.all(users.requiresLogin, reports.authors);

	// Finish by binding the Report middleware
	app.param('reportId', reports.reportByID);
};
