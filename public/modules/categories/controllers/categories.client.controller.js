'use strict';

// Categories controller
angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', '$upload', 'Authentication', 'Categories',
	function($scope, $stateParams, $location, $upload, Authentication, Categories) {
		$scope.authentication = Authentication;

		// Create new Category
		$scope.create = function() {
			var loanTime = Number.parseInt($scope.loan_time);

			if (!this.name) return swal("Error", "Vui lòng điền loại danh mục", "error"); 
			if (!loanTime || loanTime <= 0) return swal("Error", "Vui lòng điền chính xác thời hạn mượn", "error");

			// Create new Category object
			var category = new Categories ({
				name: this.name,
				description: this.description,
				loan_time: loanTime
			});

			// Redirect after save
			category.$save(function(response) {
				$location.path('categories');

				// Clear form fields
				$scope.name = '';
				return swal("Success!", "", "success");
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
			}
		};

		// Update existing Category
		$scope.update = function() {
			var loanTime = Number.parseInt($scope.category.loan_time);

			if (!this.category.name) return swal("Error", "Vui lòng điền loại danh mục", "error"); 
			if (!loanTime || loanTime <= 0) return swal("Error", "Vui lòng điền chính xác thời hạn mượn", "error");

			var category = $scope.category;

			category.$update(function() {
				$location.path('categories');
				return swal("Updated!", "", "success"); 
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

		// Go to 
		$scope.go = function(url) {
			$location.path(url);
		}
	}
]);