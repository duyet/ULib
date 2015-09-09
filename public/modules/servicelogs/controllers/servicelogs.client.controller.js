'use strict';

// Servicelogs controller
angular.module('servicelogs').controller('ServicelogsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Servicelogs', 'Services',
	function($scope, $stateParams, $location, Authentication, Servicelogs, Services) {
		$scope.authentication = Authentication;
		console.log($scope.authentication);
		
		// Load services
		$scope.services = Services.query(function(data) {
			$scope.service_id = data[0].id;
		});

		// Create new Servicelog
		$scope.create = function() {
			// Create new Servicelog object
			var servicelog = new Servicelogs ({
				service_id: this.service_id,
				prices: this.prices,
				note: this.note,
				staff_id: $scope.authentication.user.id
			});

			// Redirect after save
			servicelog.$save(function(response) {
				$location.path('servicelogs');

				// Clear form fields
				$scope.name = '';
				return swal("Success!", "", "success");
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// View modal service info 
		$scope.viewServiceInfo = function(serviceData) {
			$scope.serviceInfo = serviceData;
			$('#serviceInfo').modal('show');
		}

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
				$location.path('servicelogs');
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
	
		// Go to 
		$scope.go = function(url) {
			$location.path(url);
		}
	}
]);