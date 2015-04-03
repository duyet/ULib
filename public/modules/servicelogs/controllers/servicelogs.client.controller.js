'use strict';

// Servicelogs controller
angular.module('servicelogs').controller('ServicelogsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Servicelogs',
	function($scope, $stateParams, $location, Authentication, Servicelogs) {
		$scope.authentication = Authentication;

		// Create new Servicelog
		$scope.create = function() {
			// Create new Servicelog object
			var servicelog = new Servicelogs ({
				name: this.name
			});

			// Redirect after save
			servicelog.$save(function(response) {
				$location.path('servicelogs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Servicelog
		$scope.remove = function(servicelog) {
			if ( servicelog ) { 
				servicelog.$remove();

				for (var i in $scope.servicelogs) {
					if ($scope.servicelogs [i] === servicelog) {
						$scope.servicelogs.splice(i, 1);
					}
				}
			} else {
				$scope.servicelog.$remove(function() {
					$location.path('servicelogs');
				});
			}
		};

		// Update existing Servicelog
		$scope.update = function() {
			var servicelog = $scope.servicelog;

			servicelog.$update(function() {
				$location.path('servicelogs/' + servicelog._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Servicelogs
		$scope.find = function() {
			$scope.servicelogs = Servicelogs.query();
		};

		// Find existing Servicelog
		$scope.findOne = function() {
			$scope.servicelog = Servicelogs.get({ 
				servicelogId: $stateParams.servicelogId
			});
		};
	}
]);