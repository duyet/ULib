'use strict';

angular.module('reports').filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=1; i < total; i++)
      input.push(i);
    return input;
  };
});

// Reports controller
angular.module('reports').controller('ReportsController', ['$scope', '$resource', '$stateParams', '$location', 'Authentication', 'Reports',
	function($scope, $resource, $stateParams, $location, Authentication, Reports) {
		$scope.authentication = Authentication;

		$scope.report = {};
		$scope.isLoading = true;

		$scope.currentMonth = (new Date()).getMonth() + 1;

		$scope.getDatetime = new Date();

		$scope.reportCategories = function(month) {
			var param = {};
			if (month) param.month = month;
			$scope.isLoading = true;
			$scope.report.total_book_loan = 0;
			$resource('reports/categories').query(param, function(data) {
				$scope.report.categories = data;
				for (var i = 0; i < data.length; i++) {
					$scope.report.total_book_loan += data[i].num;
				}
				$scope.isLoading = false;
			});
		};

		$scope.reportBooks = function(month) {
			var param = {};
			if (month) param.month = month;
			$scope.isLoading = true;
			$scope.report.total_book_loan = 0;
			$resource('reports/books').query(param, function(data) {
				$scope.report.books = data;
				for (var i = 0; i < data.length; i++) {
					console.info( data[i]);
					$scope.report.total_book_loan += data[i].num;
				}

				// Rating 
				$scope.rating = [];
				$scope.isLoading = false;
			});
		};

		$scope.reportAuthors = function(month) {
			var param = {};
			if (month) param.month = month;
			$scope.isLoading = true;
			$scope.report.total_book_loan = 0;
			$resource('reports/authors').query(param, function(data) {
				$scope.report.authors = data;
				for (var i = 0; i < data.length; i++) {
					console.info( data[i]);
					$scope.report.total_book_loan += data[i].num;
				}

				// Rating 
				$scope.rating = [];
				$scope.isLoading = false;
			});
		};

		$scope.reportLoanOutOfDate = function(month) {
			var param = {};
			if (month) param.month = month;
			$scope.isLoading = true;
			$scope.report.total_book_loan = 0;
			$resource('reports/loan_out_of_date').query(param, function(data) {
				$scope.report.books = data;
				for (var i = 0; i < data.length; i++) {
					console.info(data[i]);
					$scope.report.total_book_loan += data[i].num;
				}

				// Rating 
				$scope.rating = [];
				$scope.isLoading = false;
			});
		};

		$scope.reportPublishers = function(month) {
			var param = {};
			if (month) param.month = month;
			$scope.isLoading = true;
			$scope.report.total_book_loan = $scope.publishers_total_loan_counter = $scope.publishers_total_book_counter = 0;
			$resource('reports/publishers').query(param, function(data) {
				$scope.report.publishers = data;
				for (var i = 0; i < data.length; i++) {
					console.info(data[i]);
					$scope.publishers_total_book_counter += data[i].book_counter;
					$scope.publishers_total_loan_counter += data[i].loan_counter;
				}

				// Rating 
				$scope.rating = [];
				$scope.isLoading = false;
			});
		};

		$scope.isMonthFilter = true;
		$scope.loanDataRange = {startDate: null, endDate: null};
		$scope.reportLoans = function(month) {
			var param = {};
			if ($scope.isMonthFilter == false) {
				param.start_date = $scope.loanDataRange.startDate;
				param.end_date = $scope.loanDataRange.endDate;
			}
			else if (month) param.month = month;


			$scope.isLoading = true;
			$scope.total_loans = 0;
			$resource('reports/loans').query(param, function(data) {
				$scope.report.loans = data;
				for (var i = 0; i < data.length; i++) {
					console.info(data[i]);
					
				}

				// Rating 
				$scope.rating = [];
				$scope.isLoading = false;
			});
		};

		$scope.reportIncome = function() {
			var param = {};
			$scope.isLoading = true;
			if ($scope.isMonthFilter == false) {
				param.start_date = $scope.loanDataRange.startDate;
				param.end_date = $scope.loanDataRange.endDate;
			}
			$scope.total_income = 0;
			$resource('reports/income').query(param, function(data) {
				$scope.report.income = data;
				console.log($scope.report.income);
				for (var i = 0; i < data.length; i++) {
					$scope.total_income += data[i].prices;
				}
				$scope.isLoading = false;
			});
		};
		

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