'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
		state('commingSoon', {
			url: '/commingsoon',
			templateUrl: 'modules/core/views/commingsoon.client.view.html'
		}).
		state('info', {
			url: '/info',
			templateUrl: 'modules/core/views/info.client.view.html'
		}).
		state('help', {
			url: '/help',
			templateUrl: 'modules/core/views/help.client.view.html'
		});
	}
]);