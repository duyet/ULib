'use strict';

// Loans controller
angular.module('loans').controller('LoansController', ['$scope', '$resource', '$filter', '$stateParams', '$location', 'Authentication', 'Loans', 'Books', 'Students',
	function($scope, $resource, $filter, $stateParams, $location, Authentication, Loans, Books, Students) {
		$scope.authentication = Authentication;
		$scope.books = Books.query();

		$scope.isChooseBookActive = false;
		$scope.selectedBook = [];
		
		$scope.createData = {};
		

		$scope.fetchStudentData = function() {
			var uid = $scope.student_id || 0;
			uid = parseInt(uid);

			$scope.student_info = false;

			console.log(typeof uid);
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
				}
			});

			
		}

		$scope.chooseBook = function() {
			return $scope.isChooseBookActive = true;
		}

		$scope.isEmptyResult = false;
		$scope.searchBook = function() {
			$scope.fiteredBooks = [];
			$scope.isEmptyResult = false;
			var keyword = $scope.searchByKeyword || '';
			
			if (!(keyword.toString().length > 0)) {
				return swal("", "Vui lòng nhập mã sách hoặc tên sách", "error"); 
			}

			$resource('books/search').query({
				keyword: keyword
			}, function(books) {
				console.log(books);
				
				if (books && books.length == 0) {
					$scope.isEmptyResult = true;
				}
				$scope.fiteredBooks = books;
			});

		}

		$scope.selectBook = function(b) {
			if (!b) return false;
			
			for (var i in $scope.fiteredBooks) {
				if ($scope.fiteredBooks[i] === b) {
					$scope.fiteredBooks.splice(i, 1);
				}
			}

			var isExists = false;
			for (var i in $scope.selectedBook) {
				if ($scope.selectedBook[i] === b) {
					isExists = true;
				}
			}

			if (!isExists) $scope.selectedBook.push(b);
		}

		$scope.removeBookFromSelectedList = function(b) {
			if (!b) return false;

			for (var i in $scope.selectedBook) {
				if ($scope.selectedBook[i] === b) {
					$scope.selectedBook.splice(i, 1);
				}
			}
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
			// Create new Loan object
			var loan = new Loans ($scope.createData);

			// Redirect after save
			loan.$save(function(response) {
				$location.path('loans/' + response.insertId);
				return swal("", "Thành công", "success");
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				return swal("", $scope.error, "error");
			});
		};

		// Remove existing Loan
		$scope.remove = function(loan) {
			if ( loan ) { 
				loan.$remove();

				for (var i in $scope.loans) {
					if ($scope.loans [i] === loan) {
						$scope.loans.splice(i, 1);
					}
				}
			} else {
				$scope.loan.$remove(function() {
					$location.path('loans');
				});
			}
		};

		// Update existing Loan
		$scope.update = function() {
			var loan = $scope.loan;

			loan.$update(function() {
				$location.path('loans/' + loan._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Loans
		$scope.find = function() {
			$scope.loans = Loans.query();
		};

		// Find existing Loan
		$scope.findOne = function() {
			$scope.loan = Loans.get({ 
				loanId: $stateParams.loanId
			});

			console.log($scope.loan);
		};

		// Go to 
		$scope.go = function(url) {
			$location.path(url);
		}
	}
]);