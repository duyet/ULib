'use strict';

//Languages service used to communicate Languages REST endpoints
angular.module('languages').factory('Languages', ['$resource',
	function($resource) {
		return $resource('languages/:languageId', { languageId: '@id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);