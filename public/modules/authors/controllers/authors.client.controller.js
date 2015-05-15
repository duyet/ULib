'use strict';

// Authors controller
angular.module('authors').controller('AuthorsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Authors',
	function($scope, $stateParams, $location, Authentication, Authors) {
		$scope.authentication = Authentication;

		// Create new Author
		$scope.create = function() {
			// Create new Author object
			var author = new Authors ({
				name: this.name,
				description: this.description
			});

			// Redirect after save
			author.$save(function(response) {
				$location.path('authors');

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Author
		$scope.remove = function(author) {
			swal({
				title: "Are you sure?",
				text: "You will not be able to recover this.", 
				type: "warning",
				showCancelButton: true,   
				confirmButtonColor: "#DD6B55",   
				confirmButtonText: "Yes, delete",   
				cancelButtonText: "Cancel",   
				closeOnConfirm: false,   
				closeOnCancel: false
			}, function(isConfirm){
				if (isConfirm) {
					delete_submit();

					swal("Deleted!", "Your imaginary file has been deleted.", "success");   
				} else {     
					swal("Cancelled", "Your imaginary file is safe :)", "error");   
				} 
			});

			var delete_submit = function() {
				if ( author ) { 
					author.$remove();

					for (var i in $scope.authors) {
						if ($scope.authors [i] === author) {
							$scope.authors.splice(i, 1);
						}
					}
				} else if ($scope.author) {
					$scope.author.$remove(function() {
						$location.path('authors');
					});
				}
			}
		};

		// Update existing Author
		$scope.update = function() {
			var author = $scope.author;

			author.$update(function() {
				$location.path('authors/' + author.id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Authors
		$scope.find = function() {
			$scope.authors = Authors.query();
		};

		// Find existing Author
		$scope.findOne = function() {
			$scope.author = Authors.get({ 
				authorId: $stateParams.authorId
			});
		};

		// Go to 
		$scope.go = function(url) {
			$location.path(url);
		}
	}
]);