'use strict';

//Setting up route
angular.module('settings').config(['$stateProvider',
	function($stateProvider) {
		// Settings state routing
		$stateProvider.
		state('listSettings', {
			url: '/settings',
			templateUrl: 'modules/settings/views/list-settings.client.view.html'
		}).
		state('generalSetting', {
			url: '/settings/general',
			templateUrl: 'modules/settings/views/general-setting.client.view.html'
		}).
		state('libSetting', {
			url: '/settings/library',
			templateUrl: 'modules/settings/views/library-setting.client.view.html'
		}).
		state('debugSetting', {
			url: '/settings/debug',
			templateUrl: 'modules/settings/views/debug-setting.client.view.html'
		});	
	}
]);