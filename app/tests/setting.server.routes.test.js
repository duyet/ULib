'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Setting = mongoose.model('Setting'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, setting;

/**
 * Setting routes tests
 */
describe('Setting CRUD tests', function() {
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

		// Save a user to the test db and create new Setting
		user.save(function() {
			setting = {
				name: 'Setting Name'
			};

			done();
		});
	});

	it('should be able to save Setting instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Setting
				agent.post('/settings')
					.send(setting)
					.expect(200)
					.end(function(settingSaveErr, settingSaveRes) {
						// Handle Setting save error
						if (settingSaveErr) done(settingSaveErr);

						// Get a list of Settings
						agent.get('/settings')
							.end(function(settingsGetErr, settingsGetRes) {
								// Handle Setting save error
								if (settingsGetErr) done(settingsGetErr);

								// Get Settings list
								var settings = settingsGetRes.body;

								// Set assertions
								(settings[0].user._id).should.equal(userId);
								(settings[0].name).should.match('Setting Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Setting instance if not logged in', function(done) {
		agent.post('/settings')
			.send(setting)
			.expect(401)
			.end(function(settingSaveErr, settingSaveRes) {
				// Call the assertion callback
				done(settingSaveErr);
			});
	});

	it('should not be able to save Setting instance if no name is provided', function(done) {
		// Invalidate name field
		setting.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Setting
				agent.post('/settings')
					.send(setting)
					.expect(400)
					.end(function(settingSaveErr, settingSaveRes) {
						// Set message assertion
						(settingSaveRes.body.message).should.match('Please fill Setting name');
						
						// Handle Setting save error
						done(settingSaveErr);
					});
			});
	});

	it('should be able to update Setting instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Setting
				agent.post('/settings')
					.send(setting)
					.expect(200)
					.end(function(settingSaveErr, settingSaveRes) {
						// Handle Setting save error
						if (settingSaveErr) done(settingSaveErr);

						// Update Setting name
						setting.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Setting
						agent.put('/settings/' + settingSaveRes.body._id)
							.send(setting)
							.expect(200)
							.end(function(settingUpdateErr, settingUpdateRes) {
								// Handle Setting update error
								if (settingUpdateErr) done(settingUpdateErr);

								// Set assertions
								(settingUpdateRes.body._id).should.equal(settingSaveRes.body._id);
								(settingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Settings if not signed in', function(done) {
		// Create new Setting model instance
		var settingObj = new Setting(setting);

		// Save the Setting
		settingObj.save(function() {
			// Request Settings
			request(app).get('/settings')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Setting if not signed in', function(done) {
		// Create new Setting model instance
		var settingObj = new Setting(setting);

		// Save the Setting
		settingObj.save(function() {
			request(app).get('/settings/' + settingObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', setting.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Setting instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Setting
				agent.post('/settings')
					.send(setting)
					.expect(200)
					.end(function(settingSaveErr, settingSaveRes) {
						// Handle Setting save error
						if (settingSaveErr) done(settingSaveErr);

						// Delete existing Setting
						agent.delete('/settings/' + settingSaveRes.body._id)
							.send(setting)
							.expect(200)
							.end(function(settingDeleteErr, settingDeleteRes) {
								// Handle Setting error error
								if (settingDeleteErr) done(settingDeleteErr);

								// Set assertions
								(settingDeleteRes.body._id).should.equal(settingSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Setting instance if not signed in', function(done) {
		// Set Setting user 
		setting.user = user;

		// Create new Setting model instance
		var settingObj = new Setting(setting);

		// Save the Setting
		settingObj.save(function() {
			// Try deleting Setting
			request(app).delete('/settings/' + settingObj._id)
			.expect(401)
			.end(function(settingDeleteErr, settingDeleteRes) {
				// Set message assertion
				(settingDeleteRes.body.message).should.match('User is not logged in');

				// Handle Setting error error
				done(settingDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Setting.remove().exec();
		done();
	});
});