'use strict';

// User managers controller
angular.module('user-managers').controller('UserManagersController', ['$scope', '$stateParams', '$location', 'Authentication', 'UserManagers',
	function($scope, $stateParams, $location, Authentication, UserManagers) {
		$scope.authentication = Authentication;

		// Create new User manager
		$scope.create = function() {
			// Create new User manager object
			var userManager = new UserManagers ({
				name: this.name,
				username: this.username, 
				password: this.password, 
				email: this.email
			});

			// Redirect after save
			userManager.$save(function(response) {
				$location.path('user-managers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing User manager
		$scope.remove = function(userManager) {
			if ( userManager ) { 
				userManager.$remove();

				for (var i in $scope.userManagers) {
					if ($scope.userManagers [i] === userManager) {
						$scope.userManagers.splice(i, 1);
					}
				}
			} else {
				$scope.userManager.$remove(function() {
					$location.path('user-managers');
				});
			}
		};

		// Update existing User manager
		$scope.update = function() {
			var userManager = $scope.userManager;

			userManager.$update(function() {
				$location.path('user-managers/' + userManager._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of User managers
		$scope.find = function() {
			$scope.userManagers = UserManagers.query();
		};

		// Find existing User manager
		$scope.findOne = function() {
			$scope.userManager = UserManagers.get({ 
				userManagerId: $stateParams.userManagerId
			});
		};
	}
]);