'use strict';

// Publishers controller
angular.module('publishers').controller('PublishersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Publishers',
	function($scope, $stateParams, $location, Authentication, Publishers) {
		$scope.authentication = Authentication;

		// Create new Publisher
		$scope.create = function() {
			// Create new Publisher object
			var publisher = new Publishers ({
				name: this.name,
				description: this.description,
			});

			// Redirect after save
			publisher.$save(function(response) {
				$location.path('publishers');

				// Clear form fields
				$scope.name = '';
				$scope.description = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Publisher
		$scope.remove = function(publisher) {
			if ( publisher ) { 
				publisher.$remove();

				for (var i in $scope.publishers) {
					if ($scope.publishers [i] === publisher) {
						$scope.publishers.splice(i, 1);
					}
				}
			} else {
				$scope.publisher.$remove(function() {
					$location.path('publishers');
				});
			}
		};

		// Update existing Publisher
		$scope.update = function() {
			var publisher = $scope.publisher;

			publisher.$update(function() {
				$location.path('publishers/' + publisher.id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Publishers
		$scope.find = function() {
			$scope.publishers = Publishers.query();
		};

		// Find existing Publisher
		$scope.findOne = function() {
			$scope.publisher = Publishers.get({ 
				publisherId: $stateParams.publisherId
			});
		};
	}
]);