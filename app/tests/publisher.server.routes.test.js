'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Publisher = mongoose.model('Publisher'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, publisher;

/**
 * Publisher routes tests
 */
describe('Publisher CRUD tests', function() {
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

		// Save a user to the test db and create new Publisher
		user.save(function() {
			publisher = {
				name: 'Publisher Name'
			};

			done();
		});
	});

	it('should be able to save Publisher instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Publisher
				agent.post('/publishers')
					.send(publisher)
					.expect(200)
					.end(function(publisherSaveErr, publisherSaveRes) {
						// Handle Publisher save error
						if (publisherSaveErr) done(publisherSaveErr);

						// Get a list of Publishers
						agent.get('/publishers')
							.end(function(publishersGetErr, publishersGetRes) {
								// Handle Publisher save error
								if (publishersGetErr) done(publishersGetErr);

								// Get Publishers list
								var publishers = publishersGetRes.body;

								// Set assertions
								(publishers[0].user._id).should.equal(userId);
								(publishers[0].name).should.match('Publisher Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Publisher instance if not logged in', function(done) {
		agent.post('/publishers')
			.send(publisher)
			.expect(401)
			.end(function(publisherSaveErr, publisherSaveRes) {
				// Call the assertion callback
				done(publisherSaveErr);
			});
	});

	it('should not be able to save Publisher instance if no name is provided', function(done) {
		// Invalidate name field
		publisher.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Publisher
				agent.post('/publishers')
					.send(publisher)
					.expect(400)
					.end(function(publisherSaveErr, publisherSaveRes) {
						// Set message assertion
						(publisherSaveRes.body.message).should.match('Please fill Publisher name');
						
						// Handle Publisher save error
						done(publisherSaveErr);
					});
			});
	});

	it('should be able to update Publisher instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Publisher
				agent.post('/publishers')
					.send(publisher)
					.expect(200)
					.end(function(publisherSaveErr, publisherSaveRes) {
						// Handle Publisher save error
						if (publisherSaveErr) done(publisherSaveErr);

						// Update Publisher name
						publisher.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Publisher
						agent.put('/publishers/' + publisherSaveRes.body._id)
							.send(publisher)
							.expect(200)
							.end(function(publisherUpdateErr, publisherUpdateRes) {
								// Handle Publisher update error
								if (publisherUpdateErr) done(publisherUpdateErr);

								// Set assertions
								(publisherUpdateRes.body._id).should.equal(publisherSaveRes.body._id);
								(publisherUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Publishers if not signed in', function(done) {
		// Create new Publisher model instance
		var publisherObj = new Publisher(publisher);

		// Save the Publisher
		publisherObj.save(function() {
			// Request Publishers
			request(app).get('/publishers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Publisher if not signed in', function(done) {
		// Create new Publisher model instance
		var publisherObj = new Publisher(publisher);

		// Save the Publisher
		publisherObj.save(function() {
			request(app).get('/publishers/' + publisherObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', publisher.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Publisher instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Publisher
				agent.post('/publishers')
					.send(publisher)
					.expect(200)
					.end(function(publisherSaveErr, publisherSaveRes) {
						// Handle Publisher save error
						if (publisherSaveErr) done(publisherSaveErr);

						// Delete existing Publisher
						agent.delete('/publishers/' + publisherSaveRes.body._id)
							.send(publisher)
							.expect(200)
							.end(function(publisherDeleteErr, publisherDeleteRes) {
								// Handle Publisher error error
								if (publisherDeleteErr) done(publisherDeleteErr);

								// Set assertions
								(publisherDeleteRes.body._id).should.equal(publisherSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Publisher instance if not signed in', function(done) {
		// Set Publisher user 
		publisher.user = user;

		// Create new Publisher model instance
		var publisherObj = new Publisher(publisher);

		// Save the Publisher
		publisherObj.save(function() {
			// Try deleting Publisher
			request(app).delete('/publishers/' + publisherObj._id)
			.expect(401)
			.end(function(publisherDeleteErr, publisherDeleteRes) {
				// Set message assertion
				(publisherDeleteRes.body.message).should.match('User is not logged in');

				// Handle Publisher error error
				done(publisherDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Publisher.remove().exec();
		done();
	});
});