'use strict';

// Settings controller
angular.module('settings').controller('LibSettingsController', ['$scope', '$resource', '$stateParams', '$location', 'Authentication', 'Settings',
	function($scope, $resource, $stateParams, $location, Authentication, Settings) {
		$scope.authentication = Authentication;
		$scope.librule = [];
		$scope.generalsettings = [];

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
				$location.path('settings/' + setting.id);
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

		$scope.loadLibRule = function() {
			$resource('/settings/librules').query(function(data) {
				$scope.librules = data;
			});
		};

		$scope.loadGenerateSettings = function() {
			$resource('/settings').query(function(data) {
				$scope.generalsettings = data;
			});
		};

		// Find existing Setting
		$scope.findOne = function() {
			$scope.setting = Settings.get({ 
				settingId: $stateParams.settingId
			});
		};
	}
]);