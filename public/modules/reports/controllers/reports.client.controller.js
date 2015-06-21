'use strict';

// Reports controller
angular.module('reports').controller('ReportsController', ['$scope', '$resource', '$stateParams', '$location', 'Authentication', 'Reports',
	function($scope, $resource, $stateParams, $location, Authentication, Reports) {
		$scope.authentication = Authentication;

		$scope.report = {};
		$scope.isLoading = true;

		$scope.reportCategories = function() {
			$scope.isLoading = true;
			$scope.report.total_book_loan = 0;
			$resource('reports/categories').query(function(data) {
				$scope.report.categories = data;
				for (var i = 0; i < data.length; i++) {
					$scope.report.total_book_loan += data[i].num;
				}
				$scope.isLoading = false;
			});
		};

		$scope.reportBooks = function() {
			$scope.isLoading = true;
			$resource('reports/books').query(function(data) {
				$scope.report.categories = data;
				for (var i = 0; i < data.length; i++) {
					$scope.report.total_book_loan += data[i].num;
				}
				$scope.isLoading = false;
			});
		}

		// Create new Report
		$scope.create = function() {
			// Create new Report object
			var report = new Reports ({
				name: this.name
			});

			// Redirect after save
			report.$save(function(response) {
				$location.path('reports/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Report
		$scope.remove = function(report) {
			if ( report ) { 
				report.$remove();

				for (var i in $scope.reports) {
					if ($scope.reports [i] === report) {
						$scope.reports.splice(i, 1);
					}
				}
			} else {
				$scope.report.$remove(function() {
					$location.path('reports');
				});
			}
		};

		// Update existing Report
		$scope.update = function() {
			var report = $scope.report;

			report.$update(function() {
				$location.path('reports/' + report._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Reports
		$scope.find = function() {
			$scope.reports = Reports.query();
		};

		// Find existing Report
		$scope.findOne = function() {
			$scope.report = Reports.get({ 
				reportId: $stateParams.reportId
			});
		};
	}
]);