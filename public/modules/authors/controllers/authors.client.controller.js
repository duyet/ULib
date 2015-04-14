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
				$location.path('authors/' + response.id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Author
		$scope.remove = function(author) {
			if ( author ) { 
				author.$remove();

				for (var i in $scope.authors) {
					if ($scope.authors [i] === author) {
						$scope.authors.splice(i, 1);
					}
				}
			} else {
				$scope.author.$remove(function() {
					$location.path('authors');
				});
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
	}
]);