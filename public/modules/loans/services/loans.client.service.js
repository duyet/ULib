'use strict';

//Loans service used to communicate Loans REST endpoints
angular.module('loans').factory('Loans', ['$resource',
	function($resource) {
		return $resource('loans/:loanId', { loanId: '@id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);