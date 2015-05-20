'use strict';

// Loans controller
angular.module('loans').controller('LoansController', ['$scope', '$resource', '$filter', '$stateParams', '$location', 'Authentication', 'Loans', 'Books', 'Students',
	function($scope, $resource, $filter, $stateParams, $location, Authentication, Loans, Books, Students) {
		$scope.authentication = Authentication;
		$scope.books = Books.query();

		$scope.isChooseBookActive = false;
		$scope.selectedBook = [];
		
		// Create new Loan
		$scope.loan_time = $filter("date")(Date.now(), 'mm-dd-yyyy');

		$scope.fetchStudentData = function() {
			var uid = $scope.student_id || 0;
			uid = parseInt(uid);

			console.log(typeof uid);
			if (uid.toString().length > 8) {
				$scope.student_info = false;
				return false;
			}
			if (uid.toString().length != 8) {
				return false;
			}

			Students.get({ 
				studentId: uid
			}, function(u) {
				$scope.student_info = u;
			});

			
		}

		$scope.chooseBook = function() {
			$scope.isChooseBookActive = true;
		}

		$scope.searchBook = function() {
			var keyword = $scope.searchByKeyword || '';
			$scope.fiteredBooks = [];

			if (!(keyword.toString().length > 0)) {
				return swal("Error", "Vui lòng nhập mã sách hoặc tên sách", "error"); 
			}

			$resource('books/search').query({
				keyword: keyword
			}, function(books) {
				console.log(books);
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

			$scope.selectedBook.push(b);
		}

		$scope.create = function() {
			console.log('Creating...');

			// Create new Loan object
			var loan = new Loans ({
				student_id: this.student_id || 0,
				staff_id: this.user || 0,
				book_id: [this.book_ids] || [0]  // TODO: change book_ids to array of id of books.
			});

			// Redirect after save
			loan.$save(function(response) {
				$location.path('loans/' + response.id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
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
		};
	}
]);