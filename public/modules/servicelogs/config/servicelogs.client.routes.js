'use strict';

//Setting up route
angular.module('servicelogs').config(['$stateProvider',
	function($stateProvider) {
		// Servicelogs state routing
		$stateProvider.
		state('listServicelogs', {
			url: '/servicelogs',
			templateUrl: 'modules/servicelogs/views/list-servicelogs.client.view.html'
		}).
		state('createServicelog', {
			url: '/servicelogs/create',
			templateUrl: 'modules/servicelogs/views/create-servicelog.client.view.html'
		}).
		state('viewServicelog', {
			url: '/servicelogs/:servicelogId',
			templateUrl: 'modules/servicelogs/views/view-servicelog.client.view.html'
		}).
		state('editServicelog', {
			url: '/servicelogs/:servicelogId/edit',
			templateUrl: 'modules/servicelogs/views/edit-servicelog.client.view.html'
		});
	}
]);