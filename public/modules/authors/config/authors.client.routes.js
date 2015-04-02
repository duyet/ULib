'use strict';

//Setting up route
angular.module('authors').config(['$stateProvider',
	function($stateProvider) {
		// Authors state routing
		$stateProvider.
		state('listAuthors', {
			url: '/authors',
			templateUrl: 'modules/authors/views/list-authors.client.view.html'
		}).
		state('createAuthor', {
			url: '/authors/create',
			templateUrl: 'modules/authors/views/create-author.client.view.html'
		}).
		state('viewAuthor', {
			url: '/authors/:authorId',
			templateUrl: 'modules/authors/views/view-author.client.view.html'
		}).
		state('editAuthor', {
			url: '/authors/:authorId/edit',
			templateUrl: 'modules/authors/views/edit-author.client.view.html'
		});
	}
]);