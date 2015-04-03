'use strict';

(function() {
	// Authors Controller Spec
	describe('Authors Controller Tests', function() {
		// Initialize global variables
		var AuthorsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Authors controller.
			AuthorsController = $controller('AuthorsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Author object fetched from XHR', inject(function(Authors) {
			// Create sample Author using the Authors service
			var sampleAuthor = new Authors({
				name: 'New Author'
			});

			// Create a sample Authors array that includes the new Author
			var sampleAuthors = [sampleAuthor];

			// Set GET response
			$httpBackend.expectGET('authors').respond(sampleAuthors);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.authors).toEqualData(sampleAuthors);
		}));

		it('$scope.findOne() should create an array with one Author object fetched from XHR using a authorId URL parameter', inject(function(Authors) {
			// Define a sample Author object
			var sampleAuthor = new Authors({
				name: 'New Author'
			});

			// Set the URL parameter
			$stateParams.authorId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/authors\/([0-9a-fA-F]{24})$/).respond(sampleAuthor);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.author).toEqualData(sampleAuthor);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Authors) {
			// Create a sample Author object
			var sampleAuthorPostData = new Authors({
				name: 'New Author'
			});

			// Create a sample Author response
			var sampleAuthorResponse = new Authors({
				_id: '525cf20451979dea2c000001',
				name: 'New Author'
			});

			// Fixture mock form input values
			scope.name = 'New Author';

			// Set POST response
			$httpBackend.expectPOST('authors', sampleAuthorPostData).respond(sampleAuthorResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Author was created
			expect($location.path()).toBe('/authors/' + sampleAuthorResponse._id);
		}));

		it('$scope.update() should update a valid Author', inject(function(Authors) {
			// Define a sample Author put data
			var sampleAuthorPutData = new Authors({
				_id: '525cf20451979dea2c000001',
				name: 'New Author'
			});

			// Mock Author in scope
			scope.author = sampleAuthorPutData;

			// Set PUT response
			$httpBackend.expectPUT(/authors\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/authors/' + sampleAuthorPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid authorId and remove the Author from the scope', inject(function(Authors) {
			// Create new Author object
			var sampleAuthor = new Authors({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Authors array and include the Author
			scope.authors = [sampleAuthor];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/authors\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAuthor);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.authors.length).toBe(0);
		}));
	});
}());