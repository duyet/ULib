'use strict';

//Authors service used to communicate Authors REST endpoints
angular.module('authors').factory('Authors', ['$resource',
	function($resource) {
		return $resource('authors/:authorId', { authorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);