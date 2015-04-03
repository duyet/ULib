'use strict';

//Setting up route
angular.module('services').config(['$stateProvider',
	function($stateProvider) {
		// Services state routing
		$stateProvider.
		state('listServices', {
			url: '/services',
			templateUrl: 'modules/services/views/list-services.client.view.html'
		}).
		state('createServices', {
			url: '/services/create',
			templateUrl: 'modules/services/views/create-services.client.view.html'
		}).
		state('viewServices', {
			url: '/services/:serviceId',
			templateUrl: 'modules/services/views/view-services.client.view.html'
		}).
		state('editServices', {
			url: '/services/:serviceId/edit',
			templateUrl: 'modules/services/views/edit-services.client.view.html'
		});
	}
]);