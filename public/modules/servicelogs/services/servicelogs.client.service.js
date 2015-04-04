'use strict';

//Servicelogs service used to communicate Servicelogs REST endpoints
angular.module('servicelogs').factory('Servicelogs', ['$resource',
	function($resource) {
		return $resource('servicelogs/:servicelogId', { servicelogId: '@id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);