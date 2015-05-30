'use strict';

//Returns service used to communicate Returns REST endpoints
angular.module('returns').factory('Returns', ['$resource',
	function($resource) {
		return $resource('returns/:returnId', { returnId: '@id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);