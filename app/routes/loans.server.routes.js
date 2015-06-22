'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var loans = require('../../app/controllers/loans.server.controller');

	// Loans Routes
	app.route('/loans')
		.get(loans.list)
		.post(users.requiresLogin, loans.create);

	app.route('/loans/list_not_return')
		.get(loans.listNotReturn);

	app.route('/loans/out_of_date')
		.get(loans.out_of_date);

	app.route('/loans/loan_by_student')
		.get(loans.loan_by_student);

	app.route('/loans/return_book_submit')
		.get(loans.returnBookSubmit)
		.post(loans.returnBookSubmit);

	app.route('/loans/test')
		.get(loans.test);

	app.route('/loans/:loanId')
		.get(loans.read)
		.put(users.requiresLogin, loans.hasAuthorization, loans.update)
		.delete(users.requiresLogin, loans.hasAuthorization, loans.delete);

	// Finish by binding the Loan middleware
	app.param('loanId', loans.loanByID);
};
