'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Loan = mongoose.model('Loan'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, loan;

/**
 * Loan routes tests
 */
describe('Loan CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Loan
		user.save(function() {
			loan = {
				name: 'Loan Name'
			};

			done();
		});
	});

	it('should be able to save Loan instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Loan
				agent.post('/loans')
					.send(loan)
					.expect(200)
					.end(function(loanSaveErr, loanSaveRes) {
						// Handle Loan save error
						if (loanSaveErr) done(loanSaveErr);

						// Get a list of Loans
						agent.get('/loans')
							.end(function(loansGetErr, loansGetRes) {
								// Handle Loan save error
								if (loansGetErr) done(loansGetErr);

								// Get Loans list
								var loans = loansGetRes.body;

								// Set assertions
								(loans[0].user._id).should.equal(userId);
								(loans[0].name).should.match('Loan Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Loan instance if not logged in', function(done) {
		agent.post('/loans')
			.send(loan)
			.expect(401)
			.end(function(loanSaveErr, loanSaveRes) {
				// Call the assertion callback
				done(loanSaveErr);
			});
	});

	it('should not be able to save Loan instance if no name is provided', function(done) {
		// Invalidate name field
		loan.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Loan
				agent.post('/loans')
					.send(loan)
					.expect(400)
					.end(function(loanSaveErr, loanSaveRes) {
						// Set message assertion
						(loanSaveRes.body.message).should.match('Please fill Loan name');
						
						// Handle Loan save error
						done(loanSaveErr);
					});
			});
	});

	it('should be able to update Loan instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Loan
				agent.post('/loans')
					.send(loan)
					.expect(200)
					.end(function(loanSaveErr, loanSaveRes) {
						// Handle Loan save error
						if (loanSaveErr) done(loanSaveErr);

						// Update Loan name
						loan.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Loan
						agent.put('/loans/' + loanSaveRes.body._id)
							.send(loan)
							.expect(200)
							.end(function(loanUpdateErr, loanUpdateRes) {
								// Handle Loan update error
								if (loanUpdateErr) done(loanUpdateErr);

								// Set assertions
								(loanUpdateRes.body._id).should.equal(loanSaveRes.body._id);
								(loanUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Loans if not signed in', function(done) {
		// Create new Loan model instance
		var loanObj = new Loan(loan);

		// Save the Loan
		loanObj.save(function() {
			// Request Loans
			request(app).get('/loans')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Loan if not signed in', function(done) {
		// Create new Loan model instance
		var loanObj = new Loan(loan);

		// Save the Loan
		loanObj.save(function() {
			request(app).get('/loans/' + loanObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', loan.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Loan instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Loan
				agent.post('/loans')
					.send(loan)
					.expect(200)
					.end(function(loanSaveErr, loanSaveRes) {
						// Handle Loan save error
						if (loanSaveErr) done(loanSaveErr);

						// Delete existing Loan
						agent.delete('/loans/' + loanSaveRes.body._id)
							.send(loan)
							.expect(200)
							.end(function(loanDeleteErr, loanDeleteRes) {
								// Handle Loan error error
								if (loanDeleteErr) done(loanDeleteErr);

								// Set assertions
								(loanDeleteRes.body._id).should.equal(loanSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Loan instance if not signed in', function(done) {
		// Set Loan user 
		loan.user = user;

		// Create new Loan model instance
		var loanObj = new Loan(loan);

		// Save the Loan
		loanObj.save(function() {
			// Try deleting Loan
			request(app).delete('/loans/' + loanObj._id)
			.expect(401)
			.end(function(loanDeleteErr, loanDeleteRes) {
				// Set message assertion
				(loanDeleteRes.body.message).should.match('User is not logged in');

				// Handle Loan error error
				done(loanDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Loan.remove().exec();
		done();
	});
});