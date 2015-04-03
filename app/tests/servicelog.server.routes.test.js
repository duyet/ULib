'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Servicelog = mongoose.model('Servicelog'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, servicelog;

/**
 * Servicelog routes tests
 */
describe('Servicelog CRUD tests', function() {
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

		// Save a user to the test db and create new Servicelog
		user.save(function() {
			servicelog = {
				name: 'Servicelog Name'
			};

			done();
		});
	});

	it('should be able to save Servicelog instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Servicelog
				agent.post('/servicelogs')
					.send(servicelog)
					.expect(200)
					.end(function(servicelogSaveErr, servicelogSaveRes) {
						// Handle Servicelog save error
						if (servicelogSaveErr) done(servicelogSaveErr);

						// Get a list of Servicelogs
						agent.get('/servicelogs')
							.end(function(servicelogsGetErr, servicelogsGetRes) {
								// Handle Servicelog save error
								if (servicelogsGetErr) done(servicelogsGetErr);

								// Get Servicelogs list
								var servicelogs = servicelogsGetRes.body;

								// Set assertions
								(servicelogs[0].user._id).should.equal(userId);
								(servicelogs[0].name).should.match('Servicelog Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Servicelog instance if not logged in', function(done) {
		agent.post('/servicelogs')
			.send(servicelog)
			.expect(401)
			.end(function(servicelogSaveErr, servicelogSaveRes) {
				// Call the assertion callback
				done(servicelogSaveErr);
			});
	});

	it('should not be able to save Servicelog instance if no name is provided', function(done) {
		// Invalidate name field
		servicelog.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Servicelog
				agent.post('/servicelogs')
					.send(servicelog)
					.expect(400)
					.end(function(servicelogSaveErr, servicelogSaveRes) {
						// Set message assertion
						(servicelogSaveRes.body.message).should.match('Please fill Servicelog name');
						
						// Handle Servicelog save error
						done(servicelogSaveErr);
					});
			});
	});

	it('should be able to update Servicelog instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Servicelog
				agent.post('/servicelogs')
					.send(servicelog)
					.expect(200)
					.end(function(servicelogSaveErr, servicelogSaveRes) {
						// Handle Servicelog save error
						if (servicelogSaveErr) done(servicelogSaveErr);

						// Update Servicelog name
						servicelog.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Servicelog
						agent.put('/servicelogs/' + servicelogSaveRes.body._id)
							.send(servicelog)
							.expect(200)
							.end(function(servicelogUpdateErr, servicelogUpdateRes) {
								// Handle Servicelog update error
								if (servicelogUpdateErr) done(servicelogUpdateErr);

								// Set assertions
								(servicelogUpdateRes.body._id).should.equal(servicelogSaveRes.body._id);
								(servicelogUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Servicelogs if not signed in', function(done) {
		// Create new Servicelog model instance
		var servicelogObj = new Servicelog(servicelog);

		// Save the Servicelog
		servicelogObj.save(function() {
			// Request Servicelogs
			request(app).get('/servicelogs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Servicelog if not signed in', function(done) {
		// Create new Servicelog model instance
		var servicelogObj = new Servicelog(servicelog);

		// Save the Servicelog
		servicelogObj.save(function() {
			request(app).get('/servicelogs/' + servicelogObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', servicelog.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Servicelog instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Servicelog
				agent.post('/servicelogs')
					.send(servicelog)
					.expect(200)
					.end(function(servicelogSaveErr, servicelogSaveRes) {
						// Handle Servicelog save error
						if (servicelogSaveErr) done(servicelogSaveErr);

						// Delete existing Servicelog
						agent.delete('/servicelogs/' + servicelogSaveRes.body._id)
							.send(servicelog)
							.expect(200)
							.end(function(servicelogDeleteErr, servicelogDeleteRes) {
								// Handle Servicelog error error
								if (servicelogDeleteErr) done(servicelogDeleteErr);

								// Set assertions
								(servicelogDeleteRes.body._id).should.equal(servicelogSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Servicelog instance if not signed in', function(done) {
		// Set Servicelog user 
		servicelog.user = user;

		// Create new Servicelog model instance
		var servicelogObj = new Servicelog(servicelog);

		// Save the Servicelog
		servicelogObj.save(function() {
			// Try deleting Servicelog
			request(app).delete('/servicelogs/' + servicelogObj._id)
			.expect(401)
			.end(function(servicelogDeleteErr, servicelogDeleteRes) {
				// Set message assertion
				(servicelogDeleteRes.body.message).should.match('User is not logged in');

				// Handle Servicelog error error
				done(servicelogDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Servicelog.remove().exec();
		done();
	});
});