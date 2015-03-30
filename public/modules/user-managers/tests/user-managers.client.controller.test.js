'use strict';

(function() {
	// User managers Controller Spec
	describe('User managers Controller Tests', function() {
		// Initialize global variables
		var UserManagersController,
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

			// Initialize the User managers controller.
			UserManagersController = $controller('UserManagersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one User manager object fetched from XHR', inject(function(UserManagers) {
			// Create sample User manager using the User managers service
			var sampleUserManager = new UserManagers({
				name: 'New User manager'
			});

			// Create a sample User managers array that includes the new User manager
			var sampleUserManagers = [sampleUserManager];

			// Set GET response
			$httpBackend.expectGET('user-managers').respond(sampleUserManagers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.userManagers).toEqualData(sampleUserManagers);
		}));

		it('$scope.findOne() should create an array with one User manager object fetched from XHR using a userManagerId URL parameter', inject(function(UserManagers) {
			// Define a sample User manager object
			var sampleUserManager = new UserManagers({
				name: 'New User manager'
			});

			// Set the URL parameter
			$stateParams.userManagerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/user-managers\/([0-9a-fA-F]{24})$/).respond(sampleUserManager);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.userManager).toEqualData(sampleUserManager);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(UserManagers) {
			// Create a sample User manager object
			var sampleUserManagerPostData = new UserManagers({
				name: 'New User manager'
			});

			// Create a sample User manager response
			var sampleUserManagerResponse = new UserManagers({
				_id: '525cf20451979dea2c000001',
				name: 'New User manager'
			});

			// Fixture mock form input values
			scope.name = 'New User manager';

			// Set POST response
			$httpBackend.expectPOST('user-managers', sampleUserManagerPostData).respond(sampleUserManagerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the User manager was created
			expect($location.path()).toBe('/user-managers/' + sampleUserManagerResponse._id);
		}));

		it('$scope.update() should update a valid User manager', inject(function(UserManagers) {
			// Define a sample User manager put data
			var sampleUserManagerPutData = new UserManagers({
				_id: '525cf20451979dea2c000001',
				name: 'New User manager'
			});

			// Mock User manager in scope
			scope.userManager = sampleUserManagerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/user-managers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/user-managers/' + sampleUserManagerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid userManagerId and remove the User manager from the scope', inject(function(UserManagers) {
			// Create new User manager object
			var sampleUserManager = new UserManagers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new User managers array and include the User manager
			scope.userManagers = [sampleUserManager];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/user-managers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleUserManager);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.userManagers.length).toBe(0);
		}));
	});
}());