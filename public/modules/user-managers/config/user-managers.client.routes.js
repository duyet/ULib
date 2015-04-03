'use strict';

//Setting up route
angular.module('user-managers').config(['$stateProvider',
	function($stateProvider) {
		// User managers state routing
		$stateProvider.
		state('listUserManagers', {
			url: '/user-managers',
			templateUrl: 'modules/user-managers/views/list-user-managers.client.view.html'
		}).
		state('createUserManager', {
			url: '/user-managers/create',
			templateUrl: 'modules/user-managers/views/create-user-manager.client.view.html'
		}).
		state('viewUserManager', {
			url: '/user-managers/:userManagerId',
			templateUrl: 'modules/user-managers/views/view-user-manager.client.view.html'
		}).
		state('editUserManager', {
			url: '/user-managers/:userManagerId/edit',
			templateUrl: 'modules/user-managers/views/edit-user-manager.client.view.html'
		});
	}
]);