'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	UserManager = mongoose.model('UserManager'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, userManager;

/**
 * User manager routes tests
 */
describe('User manager CRUD tests', function() {
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

		// Save a user to the test db and create new User manager
		user.save(function() {
			userManager = {
				name: 'User manager Name'
			};

			done();
		});
	});

	it('should be able to save User manager instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User manager
				agent.post('/user-managers')
					.send(userManager)
					.expect(200)
					.end(function(userManagerSaveErr, userManagerSaveRes) {
						// Handle User manager save error
						if (userManagerSaveErr) done(userManagerSaveErr);

						// Get a list of User managers
						agent.get('/user-managers')
							.end(function(userManagersGetErr, userManagersGetRes) {
								// Handle User manager save error
								if (userManagersGetErr) done(userManagersGetErr);

								// Get User managers list
								var userManagers = userManagersGetRes.body;

								// Set assertions
								(userManagers[0].user._id).should.equal(userId);
								(userManagers[0].name).should.match('User manager Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save User manager instance if not logged in', function(done) {
		agent.post('/user-managers')
			.send(userManager)
			.expect(401)
			.end(function(userManagerSaveErr, userManagerSaveRes) {
				// Call the assertion callback
				done(userManagerSaveErr);
			});
	});

	it('should not be able to save User manager instance if no name is provided', function(done) {
		// Invalidate name field
		userManager.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User manager
				agent.post('/user-managers')
					.send(userManager)
					.expect(400)
					.end(function(userManagerSaveErr, userManagerSaveRes) {
						// Set message assertion
						(userManagerSaveRes.body.message).should.match('Please fill User manager name');
						
						// Handle User manager save error
						done(userManagerSaveErr);
					});
			});
	});

	it('should be able to update User manager instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User manager
				agent.post('/user-managers')
					.send(userManager)
					.expect(200)
					.end(function(userManagerSaveErr, userManagerSaveRes) {
						// Handle User manager save error
						if (userManagerSaveErr) done(userManagerSaveErr);

						// Update User manager name
						userManager.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing User manager
						agent.put('/user-managers/' + userManagerSaveRes.body._id)
							.send(userManager)
							.expect(200)
							.end(function(userManagerUpdateErr, userManagerUpdateRes) {
								// Handle User manager update error
								if (userManagerUpdateErr) done(userManagerUpdateErr);

								// Set assertions
								(userManagerUpdateRes.body._id).should.equal(userManagerSaveRes.body._id);
								(userManagerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of User managers if not signed in', function(done) {
		// Create new User manager model instance
		var userManagerObj = new UserManager(userManager);

		// Save the User manager
		userManagerObj.save(function() {
			// Request User managers
			request(app).get('/user-managers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single User manager if not signed in', function(done) {
		// Create new User manager model instance
		var userManagerObj = new UserManager(userManager);

		// Save the User manager
		userManagerObj.save(function() {
			request(app).get('/user-managers/' + userManagerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', userManager.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete User manager instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User manager
				agent.post('/user-managers')
					.send(userManager)
					.expect(200)
					.end(function(userManagerSaveErr, userManagerSaveRes) {
						// Handle User manager save error
						if (userManagerSaveErr) done(userManagerSaveErr);

						// Delete existing User manager
						agent.delete('/user-managers/' + userManagerSaveRes.body._id)
							.send(userManager)
							.expect(200)
							.end(function(userManagerDeleteErr, userManagerDeleteRes) {
								// Handle User manager error error
								if (userManagerDeleteErr) done(userManagerDeleteErr);

								// Set assertions
								(userManagerDeleteRes.body._id).should.equal(userManagerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete User manager instance if not signed in', function(done) {
		// Set User manager user 
		userManager.user = user;

		// Create new User manager model instance
		var userManagerObj = new UserManager(userManager);

		// Save the User manager
		userManagerObj.save(function() {
			// Try deleting User manager
			request(app).delete('/user-managers/' + userManagerObj._id)
			.expect(401)
			.end(function(userManagerDeleteErr, userManagerDeleteRes) {
				// Set message assertion
				(userManagerDeleteRes.body.message).should.match('User is not logged in');

				// Handle User manager error error
				done(userManagerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		UserManager.remove().exec();
		done();
	});
});