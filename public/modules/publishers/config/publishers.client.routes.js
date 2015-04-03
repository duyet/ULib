'use strict';

//Setting up route
angular.module('publishers').config(['$stateProvider',
	function($stateProvider) {
		// Publishers state routing
		$stateProvider.
		state('listPublishers', {
			url: '/publishers',
			templateUrl: 'modules/publishers/views/list-publishers.client.view.html'
		}).
		state('createPublisher', {
			url: '/publishers/create',
			templateUrl: 'modules/publishers/views/create-publisher.client.view.html'
		}).
		state('viewPublisher', {
			url: '/publishers/:publisherId',
			templateUrl: 'modules/publishers/views/view-publisher.client.view.html'
		}).
		state('editPublisher', {
			url: '/publishers/:publisherId/edit',
			templateUrl: 'modules/publishers/views/edit-publisher.client.view.html'
		});
	}
]);