'use strict';

//Setting up route
angular.module('languages').config(['$stateProvider',
	function($stateProvider) {
		// Languages state routing
		$stateProvider.
		state('listLanguages', {
			url: '/languages',
			templateUrl: 'modules/languages/views/list-languages.client.view.html'
		}).
		state('createLanguage', {
			url: '/languages/create',
			templateUrl: 'modules/languages/views/create-language.client.view.html'
		}).
		state('viewLanguage', {
			url: '/languages/:languageId',
			templateUrl: 'modules/languages/views/view-language.client.view.html'
		}).
		state('editLanguage', {
			url: '/languages/:languageId/edit',
			templateUrl: 'modules/languages/views/edit-language.client.view.html'
		});
	}
]);