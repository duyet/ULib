'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('categories').factory('Categories', ['$resource',
	function($resource) {
		return $resource('categories/:categoryId', { categoryId: '@category_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);