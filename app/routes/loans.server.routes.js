'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var loans = require('../../app/controllers/loans.server.controller');

	// Loans Routes
	app.route('/loans')
		.get(loans.list)
		.post(users.requiresLogin, loans.create);

	app.route('/loans/:loanId')
		.get(loans.read)
		.put(users.requiresLogin, loans.hasAuthorization, loans.update)
		.delete(users.requiresLogin, loans.hasAuthorization, loans.delete);

	// Finish by binding the Loan middleware
	app.param('loanId', loans.loanByID);
};
