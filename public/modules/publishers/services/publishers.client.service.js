'use strict';

//Publishers service used to communicate Publishers REST endpoints
angular.module('publishers').factory('Publishers', ['$resource',
	function($resource) {
		return $resource('publishers/:publisherId', { publisherId: '@publisher_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);