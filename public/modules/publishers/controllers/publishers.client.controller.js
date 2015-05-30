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
				return swal("Success!", "", "success");
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Publisher
		$scope.remove = function(publisher) {
			swal({
				title: "Are you sure?",
				type: "warning",
				showCancelButton: true,   
				confirmButtonColor: "#DD6B55",   
				confirmButtonText: "Yes, delete",   
				cancelButtonText: "Cancel",   
				closeOnConfirm: false,   
				closeOnCancel: true
			}, function(isConfirm){
				if (isConfirm) {
					delete_submit();

					swal("Deleted!", "Your imaginary file has been deleted.", "success");   
				} else {     
					//swal("Cancelled", "Your imaginary file is safe :)", "error");   
				} 
			});

			var delete_submit = function() {
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
			}

		};

		// Update existing Publisher
		$scope.update = function() {
			var publisher = $scope.publisher;

			publisher.$update(function() {
				$location.path('publishers');
				return swal("Updated!", "", "success"); 
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

		// Go to 
		$scope.go = function(url) {
			$location.path(url);
		}
	}
]);