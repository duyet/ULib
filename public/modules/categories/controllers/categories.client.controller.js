'use strict';

// Categories controller
angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', '$upload', 'Authentication', 'Categories',
	function($scope, $stateParams, $location, $upload, Authentication, Categories) {
		$scope.authentication = Authentication;

		// Create new Category
		$scope.create = function() {
			// Create new Category object
			var category = new Categories ({
				name: this.name,
				description: this.description,
				loan_time: this.loan_time
			});

			// Redirect after save
			category.$save(function(response) {
				$location.path('categories/' + response.id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.$watch('fileimport', function () {
			if ($scope.fileimport && $scope.fileimport.length > 0 && $scope.fileimport[0].name.length > 0) $scope.uploadBtnStatus = $scope.fileimport[0].name;
		});

		// Import Categories
		$scope.import = function() {
			if (!$scope.fileimport || $scope.fileimport.length == 0) {
				$scope.error = 'Please choose import file.';
				return false;
			}

			$scope.uploadStatus = '';
			$upload.upload({
				url: 'categories/import',
				fields: {

				},
				file: $scope.fileimport,
			}).progress(function(evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				$scope.uploadStatus = 'Uploading ' + progressPercentage + '%';

				if (progressPercentage == 100) $scope.uploadStatus = 'Importing ...';

				console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
			}).success(function(data, status, headers, config) {
				console.log(data, status, headers, config);
				$scope.uploadStatus = '';
				$scope.success = data;
			}).error(function(err) {
				$scope.error = err.message;
			});
		};

		// Remove existing Category
		$scope.remove = function(category) {
			if ( category ) { 
				category.$remove();

				for (var i in $scope.categories) {
					if ($scope.categories [i] === category) {
						$scope.categories.splice(i, 1);
					}
				}
			} else {
				$scope.category.$remove(function() {
					$location.path('categories');
				});
			}
		};

		// Update existing Category
		$scope.update = function() {
			var category = $scope.category;

			category.$update(function() {
				$location.path('categories/' + category.id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Categories
		$scope.find = function() {
			$scope.categories = Categories.query();
		};

		// Find existing Category
		$scope.findOne = function() {
			$scope.category = Categories.get({ 
				categoryId: $stateParams.categoryId
			});
		};
	}
]);