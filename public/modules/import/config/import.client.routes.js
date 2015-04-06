'use strict';

//Setting up route
angular.module('import').config(['$stateProvider',
	function($stateProvider) {
		// Import state routing
		$stateProvider.
		state('import', {
			url: '/import',
			templateUrl: 'modules/import/views/import.client.view.html'
		}).state('importForModule', {
			url: '/books/:module',
			templateUrl: 'modules/import/views/import-module.client.view.html'
		}).;
	}
]);