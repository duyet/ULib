'use strict';

// Settings controller
angular.module('settings').controller('SettingsController', ['$scope', '$resource', '$stateParams', '$location', 'Authentication', 'Settings',
	function($scope, $resource, $stateParams, $location, Authentication, Settings) {
		$scope.authentication = Authentication;
//		var LibRules = $resource('settings/librules');


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
		//	LibRules.query({}, function(data) {
		//		$scope.librules = data;
		//	});

			console.log('Find()');

			$scope.settings = Settings.query();

		};

		// Find existing Setting
		$scope.findOne = function() {
			$scope.setting = Settings.get({ 
				settingId: $stateParams.settingId
			});
		};
	}
]);