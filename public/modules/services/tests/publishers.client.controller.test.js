'use strict';

(function() {
	// Publishers Controller Spec
	describe('Publishers Controller Tests', function() {
		// Initialize global variables
		var PublishersController,
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

			// Initialize the Publishers controller.
			PublishersController = $controller('PublishersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Publisher object fetched from XHR', inject(function(Publishers) {
			// Create sample Publisher using the Publishers service
			var samplePublisher = new Publishers({
				name: 'New Publisher'
			});

			// Create a sample Publishers array that includes the new Publisher
			var samplePublishers = [samplePublisher];

			// Set GET response
			$httpBackend.expectGET('publishers').respond(samplePublishers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.publishers).toEqualData(samplePublishers);
		}));

		it('$scope.findOne() should create an array with one Publisher object fetched from XHR using a publisherId URL parameter', inject(function(Publishers) {
			// Define a sample Publisher object
			var samplePublisher = new Publishers({
				name: 'New Publisher'
			});

			// Set the URL parameter
			$stateParams.publisherId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/publishers\/([0-9a-fA-F]{24})$/).respond(samplePublisher);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.publisher).toEqualData(samplePublisher);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Publishers) {
			// Create a sample Publisher object
			var samplePublisherPostData = new Publishers({
				name: 'New Publisher'
			});

			// Create a sample Publisher response
			var samplePublisherResponse = new Publishers({
				_id: '525cf20451979dea2c000001',
				name: 'New Publisher'
			});

			// Fixture mock form input values
			scope.name = 'New Publisher';

			// Set POST response
			$httpBackend.expectPOST('publishers', samplePublisherPostData).respond(samplePublisherResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Publisher was created
			expect($location.path()).toBe('/publishers/' + samplePublisherResponse._id);
		}));

		it('$scope.update() should update a valid Publisher', inject(function(Publishers) {
			// Define a sample Publisher put data
			var samplePublisherPutData = new Publishers({
				_id: '525cf20451979dea2c000001',
				name: 'New Publisher'
			});

			// Mock Publisher in scope
			scope.publisher = samplePublisherPutData;

			// Set PUT response
			$httpBackend.expectPUT(/publishers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/publishers/' + samplePublisherPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid publisherId and remove the Publisher from the scope', inject(function(Publishers) {
			// Create new Publisher object
			var samplePublisher = new Publishers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Publishers array and include the Publisher
			scope.publishers = [samplePublisher];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/publishers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePublisher);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.publishers.length).toBe(0);
		}));
	});
}());