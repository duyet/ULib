'use strict';

//User managers service used to communicate User managers REST endpoints
angular.module('user-managers').factory('UserManagers', ['$resource',
	function($resource) {
		return $resource('user-managers/:userManagerId', { userManagerId: '@id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);