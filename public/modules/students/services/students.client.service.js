'use strict';

//Students service used to communicate Students REST endpoints
angular.module('students').factory('Students', ['$resource',
	function($resource) {
		return $resource('students/:studentId', { studentId: '@id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);