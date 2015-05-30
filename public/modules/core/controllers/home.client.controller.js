'use strict';


angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication',
	function($scope, $location, Authentication) {
		if (!Authentication.isAuthorized) $location.path('signin');
		
		// This provides Authentication context.
		$scope.authentication = Authentication;

		console.log(Authentication);

		$scope.go = function(url) {
			$location.path(url);
		}

		
	}
]);