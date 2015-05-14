'use strict';

(function() {
	// Settings Controller Spec
	describe('Settings Controller Tests', function() {
		// Initialize global variables
		var SettingsController,
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

			// Initialize the Settings controller.
			SettingsController = $controller('SettingsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Setting object fetched from XHR', inject(function(Settings) {
			// Create sample Setting using the Settings service
			var sampleSetting = new Settings({
				name: 'New Setting'
			});

			// Create a sample Settings array that includes the new Setting
			var sampleSettings = [sampleSetting];

			// Set GET response
			$httpBackend.expectGET('settings').respond(sampleSettings);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.settings).toEqualData(sampleSettings);
		}));

		it('$scope.findOne() should create an array with one Setting object fetched from XHR using a settingId URL parameter', inject(function(Settings) {
			// Define a sample Setting object
			var sampleSetting = new Settings({
				name: 'New Setting'
			});

			// Set the URL parameter
			$stateParams.settingId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/settings\/([0-9a-fA-F]{24})$/).respond(sampleSetting);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.setting).toEqualData(sampleSetting);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Settings) {
			// Create a sample Setting object
			var sampleSettingPostData = new Settings({
				name: 'New Setting'
			});

			// Create a sample Setting response
			var sampleSettingResponse = new Settings({
				_id: '525cf20451979dea2c000001',
				name: 'New Setting'
			});

			// Fixture mock form input values
			scope.name = 'New Setting';

			// Set POST response
			$httpBackend.expectPOST('settings', sampleSettingPostData).respond(sampleSettingResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Setting was created
			expect($location.path()).toBe('/settings/' + sampleSettingResponse._id);
		}));

		it('$scope.update() should update a valid Setting', inject(function(Settings) {
			// Define a sample Setting put data
			var sampleSettingPutData = new Settings({
				_id: '525cf20451979dea2c000001',
				name: 'New Setting'
			});

			// Mock Setting in scope
			scope.setting = sampleSettingPutData;

			// Set PUT response
			$httpBackend.expectPUT(/settings\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/settings/' + sampleSettingPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid settingId and remove the Setting from the scope', inject(function(Settings) {
			// Create new Setting object
			var sampleSetting = new Settings({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Settings array and include the Setting
			scope.settings = [sampleSetting];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/settings\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSetting);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.settings.length).toBe(0);
		}));
	});
}());