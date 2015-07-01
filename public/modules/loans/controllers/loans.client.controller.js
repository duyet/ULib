'use strict';

// Loans controller
angular.module('loans').controller('LoansController', ['$scope', '$resource', '$filter', '$stateParams', '$location', 'Authentication', 'Loans', 'Books', 'Students',
	function($scope, $resource, $filter, $stateParams, $location, Authentication, Loans, Books, Students) {
		$scope.authentication = Authentication;
		//$scope.books = Books.query();

		$scope.isChooseBookActive = false;
		$scope.selectedBook = [];
		
		$scope.createData = {};
		$scope.librules = {};
		$scope.librules.min_number_of_books = 100;

		$scope.canBooking = true;

		$scope.debug = false;

		$scope.fetchStudentData = function() {
			var uid = $scope.student_id_input;
			// uid = parseInt(uid);

			$scope.student_info = false;

			if (uid.toString().length > 8) {
				console.error("Length > 8", uid);
				$scope.student_info = false;
				return false;
			}
			else if (uid.toString().length < 6) {
				console.error("Length < 6", uid);
				return false;
			}

			console.error("Got here", uid);

			Students.get({ 
				studentId: uid
			}, function(u) {
				if (u) {
					$scope.listBookNotReturnedByUid = false;
					$scope.canBooking = true;
					$scope.createData.student = $scope.student_info = u;
					if (u) {
						$scope.fetchNotReturnBooks(uid);
					}
				}
			});
		}

		$scope.fetchNotReturnBooks = function(uid) {
			$scope.canBooking = true;
			$resource('loans/list_not_return').query({
				student_id: uid
			}, function(data) {
				if (data && data.length) {
					$scope.listBookNotReturnedByUid = data;
					$scope.canBooking = false;
				}
				else $scope.listBookNotReturnedByUid = false;
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
			
			if (!$scope.canBooking) {
				return swal("", "Sinh viên chưa trả sách, không thể lập phiếu mượn mới", "error"); 
			}

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
			
			if (!b.can_booking) {
				// return swal("", "Không thể mượn, số lượng sách đang dưới mức tồn kho quy định!	", "error"); 
			
				return swal({
					title: "Lập phiếu đặt trước?",
					text: "Sách dưới ngưỡng tồn nên k thể mượn, lập phiếu đặt trước cho sách này?",   
					type: "warning",   
					showCancelButton: true,   
					confirmButtonColor: "#11ABEF",   
					confirmButtonText: "Đặt",   
					cancelButtonText: "Hủy",   
					closeOnConfirm: false,   
					closeOnCancel: false 
				}, function(isConfirm){   
					if (isConfirm) {     
						$location.path('loans/preoder');
					} else {     
						return swal("", "Không thể mượn, số lượng sách đang dưới mức tồn kho quy định!", "error");   
					} 
				});
			}

			for (var i in $scope.fiteredBooks) {
				if ($scope.fiteredBooks[i] === b) {
					$scope.fiteredBooks.splice(i, 1);
				}
			}

			var isExists = false;
			for (var i in $scope.selectedBook) {
				if ($scope.selectedBook[i].book_id === b.book_id) {
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
			if (!$scope.canBooking) {
				return swal("", "Sinh viên chưa trả sách, không thể lập phiếu mượn mới", "error"); 
			}

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