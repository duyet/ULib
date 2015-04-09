'use strict';

//Loans service used to communicate Loans REST endpoints
angular.module('loans').factory('Loans', ['$resource',
	function($resource) {
		return $resource('loans/:loanId', { loanId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);