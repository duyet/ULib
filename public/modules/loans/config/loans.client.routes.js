'use strict';

//Setting up route
angular.module('loans').config(['$stateProvider',
	function($stateProvider) {
		// Loans state routing
		$stateProvider.
		state('listLoans', {
			url: '/loans',
			templateUrl: 'modules/loans/views/list-loans.client.view.html'
		}).
		state('createLoan', {
			url: '/loans/create',
			templateUrl: 'modules/loans/views/create-loan.client.view.html'
		}).
		state('viewLoan', {
			url: '/loans/:loanId',
			templateUrl: 'modules/loans/views/view-loan.client.view.html'
		}).
		state('editLoan', {
			url: '/loans/:loanId/edit',
			templateUrl: 'modules/loans/views/edit-loan.client.view.html'
		});
	}
]);