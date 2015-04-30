'use strict';

// Settings controller
angular.module('settings').controller('SettingsController', ['$scope', '$stateParams', '$location', 'cfp.loadingBar', 'Authentication', 'Settings',
	function($scope, $stateParams, $location, $loadingBar, Authentication, Settings) {
		$scope.authentication = Authentication;

		// Toggle debug
		$scope.debugToggle = function() {
			var mode = ($scope.activedebug !== true) ? false : true;
			$loadingBar.start();
		};
		
		// Remove existing Setting
		$scope.remove = function(setting) {
			if ( setting ) { 
				setting.$remove();

				for (var i in $scope.settings) {
					if ($scope.settings [i] === setting) {
						$scope.settings.splice(i, 1);
					}
				}
			} else {
				$scope.setting.$remove(function() {
					$location.path('settings');
				});
			}
		};

		// Update existing Setting
		$scope.update = function() {
			var setting = $scope.setting;

			setting.$update(function() {
				$location.path('settings/' + setting._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Settings
		$scope.find = function() {
			$scope.settings = Settings.query();
			console.log($scope.settings);
			// Parse list laguage to array
			if ($scope.settings.languages) $scope.settings.languages = $scope.settings.languages.split(',');
		};

		// Find existing Setting
		$scope.findOne = function() {
			$scope.setting = Settings.get({ 
				settingId: $stateParams.settingId
			});
		};
	}
]);