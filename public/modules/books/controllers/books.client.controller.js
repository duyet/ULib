'use strict';

// Books controller
angular.module('books').controller('BooksController', ['$scope', '$stateParams', '$location', '$upload', '$timeout', 'Authentication', 'Books', 'Categories', 'Languages', 'Publishers', 'Authors',
	function($scope, $stateParams, $location, $upload, $timeout, Authentication, Books, Categories, Languages, Publishers, Authors) {
		$scope.authentication = Authentication;
		$scope.categories = Categories.query();
		$scope.languages = Languages.query();
		$scope.publishers = Publishers.query();
		$scope.authors = Authors.query();

		$scope.currentUrl = $location.absUrl();
		$scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);

		$scope.available_number
		$scope.$watch('number', function () {
			$scope.available_number = $scope.number;
		});

		// Create new Book
		$scope.create = function() {
			// Create new Book object
			var book = new Books ({
				book_id: this.book_id,
				category_id: this.category_id,
				language_id: this.language_id,
				name: this.name,
				publisher_id: this.publisher_id,
				number: this.number,
				description: this.description,
				available_number: this.available_number,
				publish_date: this.publish_date,
				image: $scope.image_url || '',
				status: this.status,
			});

			// Redirect after save
			book.$save(function(response) {
				$location.path('books/' + response.id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message.join("<br>");
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

		// Auto upload when select
		$scope.$watch('image_upload', function () {
			$scope.upload($scope.image_upload);
		});

		$scope.upload = function(files) {
		    if (files && files.length) {
		        for (var i = 0; i < files.length; i++) {
		            var file = files[i];

		            $scope.uploadStatus = false;
		            $upload.upload({
		                url: 'books/image_upload',
		                fields: {
		                
		                },
		                file: file
		            }).progress(function(evt) {
		                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

		                $scope.uploadStatus = 'Uploading ' + progressPercentage + '%';

						console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
		            }).success(function(data, status, headers, config) {
						console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
						
						$scope.image_url = data;
		            });
		        }
		    }
		};

		$scope.generateThumb = function(file) {
			if (file != null) {
				if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
					$timeout(function() {
						var fileReader = new FileReader();
						fileReader.readAsDataURL(file);
						fileReader.onload = function(e) {
							$timeout(function() {
								file.dataUrl = e.target.result;
							});
						}
					});
				}
			}
		};
	}
]);