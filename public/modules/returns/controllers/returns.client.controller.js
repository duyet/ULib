'use strict';

// Returns controller
angular.module('returns').controller('ReturnsController', ['$scope', '$resource', '$filter', '$stateParams', '$location', 'Authentication', 'Returns', 'Books', 'Students',
	function($scope, $resource, $filter, $stateParams, $location, Authentication, Returns, Books, Students) {
		$scope.authentication = Authentication;
		$scope.student_info = false;
		$scope.createData = {};
		$scope.loan_detail = false;
		$scope.isNotLoan = false;

		$scope.fetchStudentData = function() {
			var uid = $scope.student_id || 0;
			//uid = parseInt(uid);

			$scope.student_info = false;

			if (uid.toString().length > 8) {
				$scope.student_info = false;
				return false;
			}
			if (uid.toString().length < 6) {
				return false;
			}

			Students.get({ 
				studentId: uid
			}, function(u) {
				if (u) {
					$scope.createData.student = $scope.student_info = u;
					$scope.fetchLoanDetail(u.student_id);
				}
			});
		}

		$scope.fetchLoanDetail = function(student_id) {
			$scope.loan_details = {};
			$scope.isNotLoan = false;

			$resource('loans/list_not_return').query({
				student_id: student_id
			}, function(data) {
				if (data) {
					$scope.loan_details.loan_id = data[0].loan_id || 0;
					$scope.loan_details.time_created = data[0].time_created || '';
					$scope.loan_details.data = data;
				}
				else $scope.isNotLoan = true;
			});
		}

		$scope.returnSubmit = function() {
			$scope.success = false;

			var list_book_return = [];
			$scope.loan_details.data.forEach(function(loan) {
				if (loan.is_selected === true) list_book_return.push(loan.book_id);
			});

			if (!list_book_return)
				return swal("", "Vui lòng chọn ít nhất 1 quyển", "error");  

			$resource('loans/return_book_submit').post({
				books: list_book_return,
				loan_id: $scope.loan_details.loan_id
			}, function(data) {
				if (data) $scope.success = "Thành công";
				else $scope.error = "Some thing was wrong~~";
			});
		}

		$scope.outofdatelist = [];
		$scope.findOutOfDateList = function() {
			$scope.outofdatelist = $resource('loans/out_of_date').query();
		}

		$scope.create = function() {
			if (!$scope.createData.student) {
				return swal("", "Vui lòng nhập thông tin sinh viên", "error");  
			}

			if (!$scope.selectedBook.length) {
				return swal("", "Vui lòng chọn sách cần mượn", "error");  	
			}

			$scope.createData.books = $scope.selectedBook;

			// Init time when submit
			$scope.createData.created = new Date();

			console.log('Init to create with data: ', $scope.createData);
			// Create new Return object
			//var return = new Returns ($scope.createData);

			// Redirect after save
			//return.$save(function(response) {
			//	$location.path('returns/' + response.insertId);
			//	return swal("", "Thành công", "success");
			//}, function(errorResponse) {
			//	$scope.error = errorResponse.data.message;
			//	return swal("", $scope.error, "success");
			//});
		};

		// Remove existing Return
		$scope.remove = function() {
			
		};

		// Update existing Return
		$scope.update = function() {
			
		};

		// Find a list of Returns
		$scope.find = function() {
			//$scope.returns = Returns.query();
		};

		// Find existing Return
		$scope.findOne = function() {
			
		};

		// Go to 
		$scope.go = function(url) {
			$location.path(url);
		}
	}
]);