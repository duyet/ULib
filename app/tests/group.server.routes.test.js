'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Group = mongoose.model('Group'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, group;

/**
 * Group routes tests
 */
describe('Group CRUD tests', function() {
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

		// Save a user to the test db and create new Group
		user.save(function() {
			group = {
				name: 'Group Name'
			};

			done();
		});
	});

	it('should be able to save Group instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Group
				agent.post('/groups')
					.send(group)
					.expect(200)
					.end(function(groupSaveErr, groupSaveRes) {
						// Handle Group save error
						if (groupSaveErr) done(groupSaveErr);

						// Get a list of Groups
						agent.get('/groups')
							.end(function(groupsGetErr, groupsGetRes) {
								// Handle Group save error
								if (groupsGetErr) done(groupsGetErr);

								// Get Groups list
								var groups = groupsGetRes.body;

								// Set assertions
								(groups[0].user._id).should.equal(userId);
								(groups[0].name).should.match('Group Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Group instance if not logged in', function(done) {
		agent.post('/groups')
			.send(group)
			.expect(401)
			.end(function(groupSaveErr, groupSaveRes) {
				// Call the assertion callback
				done(groupSaveErr);
			});
	});

	it('should not be able to save Group instance if no name is provided', function(done) {
		// Invalidate name field
		group.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Group
				agent.post('/groups')
					.send(group)
					.expect(400)
					.end(function(groupSaveErr, groupSaveRes) {
						// Set message assertion
						(groupSaveRes.body.message).should.match('Please fill Group name');
						
						// Handle Group save error
						done(groupSaveErr);
					});
			});
	});

	it('should be able to update Group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Group
				agent.post('/groups')
					.send(group)
					.expect(200)
					.end(function(groupSaveErr, groupSaveRes) {
						// Handle Group save error
						if (groupSaveErr) done(groupSaveErr);

						// Update Group name
						group.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Group
						agent.put('/groups/' + groupSaveRes.body._id)
							.send(group)
							.expect(200)
							.end(function(groupUpdateErr, groupUpdateRes) {
								// Handle Group update error
								if (groupUpdateErr) done(groupUpdateErr);

								// Set assertions
								(groupUpdateRes.body._id).should.equal(groupSaveRes.body._id);
								(groupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Groups if not signed in', function(done) {
		// Create new Group model instance
		var groupObj = new Group(group);

		// Save the Group
		groupObj.save(function() {
			// Request Groups
			request(app).get('/groups')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Group if not signed in', function(done) {
		// Create new Group model instance
		var groupObj = new Group(group);

		// Save the Group
		groupObj.save(function() {
			request(app).get('/groups/' + groupObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', group.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Group
				agent.post('/groups')
					.send(group)
					.expect(200)
					.end(function(groupSaveErr, groupSaveRes) {
						// Handle Group save error
						if (groupSaveErr) done(groupSaveErr);

						// Delete existing Group
						agent.delete('/groups/' + groupSaveRes.body._id)
							.send(group)
							.expect(200)
							.end(function(groupDeleteErr, groupDeleteRes) {
								// Handle Group error error
								if (groupDeleteErr) done(groupDeleteErr);

								// Set assertions
								(groupDeleteRes.body._id).should.equal(groupSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Group instance if not signed in', function(done) {
		// Set Group user 
		group.user = user;

		// Create new Group model instance
		var groupObj = new Group(group);

		// Save the Group
		groupObj.save(function() {
			// Try deleting Group
			request(app).delete('/groups/' + groupObj._id)
			.expect(401)
			.end(function(groupDeleteErr, groupDeleteRes) {
				// Set message assertion
				(groupDeleteRes.body.message).should.match('User is not logged in');

				// Handle Group error error
				done(groupDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Group.remove().exec();
		done();
	});
});