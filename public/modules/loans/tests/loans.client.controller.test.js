'use strict';

(function() {
	// Loans Controller Spec
	describe('Loans Controller Tests', function() {
		// Initialize global variables
		var LoansController,
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

			// Initialize the Loans controller.
			LoansController = $controller('LoansController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Loan object fetched from XHR', inject(function(Loans) {
			// Create sample Loan using the Loans service
			var sampleLoan = new Loans({
				name: 'New Loan'
			});

			// Create a sample Loans array that includes the new Loan
			var sampleLoans = [sampleLoan];

			// Set GET response
			$httpBackend.expectGET('loans').respond(sampleLoans);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.loans).toEqualData(sampleLoans);
		}));

		it('$scope.findOne() should create an array with one Loan object fetched from XHR using a loanId URL parameter', inject(function(Loans) {
			// Define a sample Loan object
			var sampleLoan = new Loans({
				name: 'New Loan'
			});

			// Set the URL parameter
			$stateParams.loanId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/loans\/([0-9a-fA-F]{24})$/).respond(sampleLoan);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.loan).toEqualData(sampleLoan);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Loans) {
			// Create a sample Loan object
			var sampleLoanPostData = new Loans({
				name: 'New Loan'
			});

			// Create a sample Loan response
			var sampleLoanResponse = new Loans({
				_id: '525cf20451979dea2c000001',
				name: 'New Loan'
			});

			// Fixture mock form input values
			scope.name = 'New Loan';

			// Set POST response
			$httpBackend.expectPOST('loans', sampleLoanPostData).respond(sampleLoanResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Loan was created
			expect($location.path()).toBe('/loans/' + sampleLoanResponse._id);
		}));

		it('$scope.update() should update a valid Loan', inject(function(Loans) {
			// Define a sample Loan put data
			var sampleLoanPutData = new Loans({
				_id: '525cf20451979dea2c000001',
				name: 'New Loan'
			});

			// Mock Loan in scope
			scope.loan = sampleLoanPutData;

			// Set PUT response
			$httpBackend.expectPUT(/loans\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/loans/' + sampleLoanPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid loanId and remove the Loan from the scope', inject(function(Loans) {
			// Create new Loan object
			var sampleLoan = new Loans({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Loans array and include the Loan
			scope.loans = [sampleLoan];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/loans\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLoan);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.loans.length).toBe(0);
		}));
	});
}());