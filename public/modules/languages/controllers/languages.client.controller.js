'use strict';

// Languages controller
angular.module('languages').controller('LanguagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Languages',
	function($scope, $stateParams, $location, Authentication, Languages) {
		$scope.authentication = Authentication;

		// Create new Language
		$scope.create = function() {
			// Create new Language object
			var language = new Languages ({
				name: this.name,
				description: this.description
			});

			// Redirect after save
			language.$save(function(response) {
				$location.path('languages');

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Language
		$scope.remove = function(language) {
			if ( language ) { 
				language.$remove();

				for (var i in $scope.languages) {
					if ($scope.languages [i] === language) {
						$scope.languages.splice(i, 1);
					}
				}
			} else {
				$scope.language.$remove(function() {
					$location.path('languages');
				});
			}
		};

		// Update existing Language
		$scope.update = function() {
			var language = $scope.language;

			language.$update(function() {
				$location.path('languages');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Languages
		$scope.find = function() {
			$scope.languages = Languages.query();
		};

		// Find existing Language
		$scope.findOne = function() {
			$scope.language = Languages.get({ 
				languageId: $stateParams.languageId
			});
		};

		// Go to 
		$scope.go = function(url) {
			$location.path(url);
		}
	}
]);