'use strict';

// Books controller
angular.module('books').controller('BooksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Books', 'Categories', 'Languages', 'Publishers', 'Authors',
	function($scope, $stateParams, $location, Authentication, Books, Categories, Languages, Publishers, Authors) {
		$scope.authentication = Authentication;
		$scope.categories = Categories.query();
		$scope.languages = Languages.query();
		$scope.publishers = Publishers.query();
		$scope.authors = Authors.query();

		// Create new Book
		$scope.create = function() {
			// Create new Book object
			var book = new Books ({
				id: this.id,
				category_id: this.category_id,
				language_id: this.language_id,
				name: this.name,
				publisher_id: this.publisher_id,
				number: this.number,
				description: this.description,
				available_number: this.available_number,
				publish_date: this.publish_date,
				status: this.status,
			});

			// Redirect after save
			book.$save(function(response) {
				$location.path('books/' + response.id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Book
		$scope.remove = function(book) {
			if ( book ) { 
				book.$remove();

				for (var i in $scope.books) {
					if ($scope.books [i] === book) {
						$scope.books.splice(i, 1);
					}
				}
			} else {
				$scope.book.$remove(function() {
					$location.path('books');
				});
			}
		};

		// Update existing Book
		$scope.update = function() {
			var book = $scope.book;

			book.$update(function() {
				$location.path('books/' + book.id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Books
		$scope.find = function() {
			$scope.books = Books.query();
		};

		// Find existing Book
		$scope.findOne = function() {
			$scope.book = Books.get({ 
				bookId: $stateParams.bookId
			});
		};

		$scope.loadAuthors = function(query) {
			return $scope.authors;
		};

		$scope.go = function(path) {
			$location.path(path);
		}
	}
]);