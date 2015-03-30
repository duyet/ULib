'use strict';

//User managers service used to communicate User managers REST endpoints
angular.module('user-managers').factory('UserManagers', ['$resource',
	function($resource) {
		return $resource('user-managers/:userManagerId', { userManagerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);