'use strict';

//Setting up route
angular.module('returns').config(['$stateProvider',
	function($stateProvider) {
		// Returns state routing
		$stateProvider.
		state('listReturns', {
			url: '/returns',
			templateUrl: 'modules/returns/views/list-returns.client.view.html'
		}).
		state('createReturn', {
			url: '/returns/create',
			templateUrl: 'modules/returns/views/create-returns.client.view.html'
		}).
		state('viewReturn', {
			url: '/returns/:loanId',
			templateUrl: 'modules/returns/views/view-loan.client.view.html'
		}).
		state('editReturn', {
			url: '/returns/:loanId/edit',
			templateUrl: 'modules/returns/views/edit-loan.client.view.html'
		}).
		state('listNotReturn', {
			url: '/returns/outofdate',
			templateUrl: 'modules/returns/views/list-outofdate.client.view.html'
		});
	}
]);