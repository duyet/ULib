'use strict';

//Setting up route
angular.module('about').config(['$stateProvider',
	function($stateProvider) {
		// About state routing
		$stateProvider.
		state('pabout', {
			url: '/pabout',
			templateUrl: 'modules/about/views/about.client.view.html'
		}).
		state('about', {
			url: '/about',
			templateUrl: 'modules/about/views/about.client.view.html'
		});
	}
]);