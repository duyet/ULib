'use strict';

(function() {
	// Servicelogs Controller Spec
	describe('Servicelogs Controller Tests', function() {
		// Initialize global variables
		var ServicelogsController,
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

			// Initialize the Servicelogs controller.
			ServicelogsController = $controller('ServicelogsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Servicelog object fetched from XHR', inject(function(Servicelogs) {
			// Create sample Servicelog using the Servicelogs service
			var sampleServicelog = new Servicelogs({
				name: 'New Servicelog'
			});

			// Create a sample Servicelogs array that includes the new Servicelog
			var sampleServicelogs = [sampleServicelog];

			// Set GET response
			$httpBackend.expectGET('servicelogs').respond(sampleServicelogs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.servicelogs).toEqualData(sampleServicelogs);
		}));

		it('$scope.findOne() should create an array with one Servicelog object fetched from XHR using a servicelogId URL parameter', inject(function(Servicelogs) {
			// Define a sample Servicelog object
			var sampleServicelog = new Servicelogs({
				name: 'New Servicelog'
			});

			// Set the URL parameter
			$stateParams.servicelogId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/servicelogs\/([0-9a-fA-F]{24})$/).respond(sampleServicelog);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.servicelog).toEqualData(sampleServicelog);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Servicelogs) {
			// Create a sample Servicelog object
			var sampleServicelogPostData = new Servicelogs({
				name: 'New Servicelog'
			});

			// Create a sample Servicelog response
			var sampleServicelogResponse = new Servicelogs({
				_id: '525cf20451979dea2c000001',
				name: 'New Servicelog'
			});

			// Fixture mock form input values
			scope.name = 'New Servicelog';

			// Set POST response
			$httpBackend.expectPOST('servicelogs', sampleServicelogPostData).respond(sampleServicelogResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Servicelog was created
			expect($location.path()).toBe('/servicelogs/' + sampleServicelogResponse._id);
		}));

		it('$scope.update() should update a valid Servicelog', inject(function(Servicelogs) {
			// Define a sample Servicelog put data
			var sampleServicelogPutData = new Servicelogs({
				_id: '525cf20451979dea2c000001',
				name: 'New Servicelog'
			});

			// Mock Servicelog in scope
			scope.servicelog = sampleServicelogPutData;

			// Set PUT response
			$httpBackend.expectPUT(/servicelogs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/servicelogs/' + sampleServicelogPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid servicelogId and remove the Servicelog from the scope', inject(function(Servicelogs) {
			// Create new Servicelog object
			var sampleServicelog = new Servicelogs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Servicelogs array and include the Servicelog
			scope.servicelogs = [sampleServicelog];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/servicelogs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleServicelog);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.servicelogs.length).toBe(0);
		}));
	});
}());