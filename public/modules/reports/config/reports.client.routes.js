'use strict';

//Setting up route
angular.module('reports').config(['$stateProvider',
	function($stateProvider) {
		// Reports state routing
		$stateProvider.
		state('listReports', {
			url: '/reports',
			templateUrl: 'modules/reports/views/list-reports.client.view.html'
		}).
		state('loanReports', {
			url: '/reports/loans',
			templateUrl: 'modules/reports/views/loans-reports.client.view.html'
		}).
		state('reportLoanOutOfDate', {
			url: '/reports/loan_out_of_date',
			templateUrl: 'modules/reports/views/loanoutofdate-report.client.view.html'
		}).
		state('reportsCategories', {
			url: '/reports/categories',
			templateUrl: 'modules/reports/views/categories-report.client.view.html'
		}).
		state('reportsBooks', {
			url: '/reports/books',
			templateUrl: 'modules/reports/views/books-report.client.view.html'
		}).
		state('reportsPublisher', {
			url: '/reports/publishers',
			templateUrl: 'modules/reports/views/publishers-report.client.view.html'
		}).
		state('reportsAuthor', {
			url: '/reports/authors',
			templateUrl: 'modules/reports/views/authors-report.client.view.html'
		}).
		state('reportsIncome', {
			url: '/reports/income',
			templateUrl: 'modules/reports/views/income-report.client.view.html'
		}).
		state('viewReport', {
			url: '/reports/:reportId',
			templateUrl: 'modules/reports/views/view-report.client.view.html'
		}).
		state('editReport', {
			url: '/reports/:reportId/edit',
			templateUrl: 'modules/reports/views/edit-report.client.view.html'
		});
	}
]);