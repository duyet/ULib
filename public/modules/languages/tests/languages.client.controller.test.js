'use strict';

(function() {
	// Languages Controller Spec
	describe('Languages Controller Tests', function() {
		// Initialize global variables
		var LanguagesController,
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

			// Initialize the Languages controller.
			LanguagesController = $controller('LanguagesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Language object fetched from XHR', inject(function(Languages) {
			// Create sample Language using the Languages service
			var sampleLanguage = new Languages({
				name: 'New Language'
			});

			// Create a sample Languages array that includes the new Language
			var sampleLanguages = [sampleLanguage];

			// Set GET response
			$httpBackend.expectGET('languages').respond(sampleLanguages);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.languages).toEqualData(sampleLanguages);
		}));

		it('$scope.findOne() should create an array with one Language object fetched from XHR using a languageId URL parameter', inject(function(Languages) {
			// Define a sample Language object
			var sampleLanguage = new Languages({
				name: 'New Language'
			});

			// Set the URL parameter
			$stateParams.languageId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/languages\/([0-9a-fA-F]{24})$/).respond(sampleLanguage);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.language).toEqualData(sampleLanguage);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Languages) {
			// Create a sample Language object
			var sampleLanguagePostData = new Languages({
				name: 'New Language'
			});

			// Create a sample Language response
			var sampleLanguageResponse = new Languages({
				_id: '525cf20451979dea2c000001',
				name: 'New Language'
			});

			// Fixture mock form input values
			scope.name = 'New Language';

			// Set POST response
			$httpBackend.expectPOST('languages', sampleLanguagePostData).respond(sampleLanguageResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Language was created
			expect($location.path()).toBe('/languages/' + sampleLanguageResponse._id);
		}));

		it('$scope.update() should update a valid Language', inject(function(Languages) {
			// Define a sample Language put data
			var sampleLanguagePutData = new Languages({
				_id: '525cf20451979dea2c000001',
				name: 'New Language'
			});

			// Mock Language in scope
			scope.language = sampleLanguagePutData;

			// Set PUT response
			$httpBackend.expectPUT(/languages\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/languages/' + sampleLanguagePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid languageId and remove the Language from the scope', inject(function(Languages) {
			// Create new Language object
			var sampleLanguage = new Languages({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Languages array and include the Language
			scope.languages = [sampleLanguage];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/languages\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLanguage);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.languages.length).toBe(0);
		}));
	});
}());