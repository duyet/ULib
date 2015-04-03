'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Language = mongoose.model('Language'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, language;

/**
 * Language routes tests
 */
describe('Language CRUD tests', function() {
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

		// Save a user to the test db and create new Language
		user.save(function() {
			language = {
				name: 'Language Name'
			};

			done();
		});
	});

	it('should be able to save Language instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Language
				agent.post('/languages')
					.send(language)
					.expect(200)
					.end(function(languageSaveErr, languageSaveRes) {
						// Handle Language save error
						if (languageSaveErr) done(languageSaveErr);

						// Get a list of Languages
						agent.get('/languages')
							.end(function(languagesGetErr, languagesGetRes) {
								// Handle Language save error
								if (languagesGetErr) done(languagesGetErr);

								// Get Languages list
								var languages = languagesGetRes.body;

								// Set assertions
								(languages[0].user._id).should.equal(userId);
								(languages[0].name).should.match('Language Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Language instance if not logged in', function(done) {
		agent.post('/languages')
			.send(language)
			.expect(401)
			.end(function(languageSaveErr, languageSaveRes) {
				// Call the assertion callback
				done(languageSaveErr);
			});
	});

	it('should not be able to save Language instance if no name is provided', function(done) {
		// Invalidate name field
		language.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Language
				agent.post('/languages')
					.send(language)
					.expect(400)
					.end(function(languageSaveErr, languageSaveRes) {
						// Set message assertion
						(languageSaveRes.body.message).should.match('Please fill Language name');
						
						// Handle Language save error
						done(languageSaveErr);
					});
			});
	});

	it('should be able to update Language instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Language
				agent.post('/languages')
					.send(language)
					.expect(200)
					.end(function(languageSaveErr, languageSaveRes) {
						// Handle Language save error
						if (languageSaveErr) done(languageSaveErr);

						// Update Language name
						language.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Language
						agent.put('/languages/' + languageSaveRes.body._id)
							.send(language)
							.expect(200)
							.end(function(languageUpdateErr, languageUpdateRes) {
								// Handle Language update error
								if (languageUpdateErr) done(languageUpdateErr);

								// Set assertions
								(languageUpdateRes.body._id).should.equal(languageSaveRes.body._id);
								(languageUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Languages if not signed in', function(done) {
		// Create new Language model instance
		var languageObj = new Language(language);

		// Save the Language
		languageObj.save(function() {
			// Request Languages
			request(app).get('/languages')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Language if not signed in', function(done) {
		// Create new Language model instance
		var languageObj = new Language(language);

		// Save the Language
		languageObj.save(function() {
			request(app).get('/languages/' + languageObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', language.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Language instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Language
				agent.post('/languages')
					.send(language)
					.expect(200)
					.end(function(languageSaveErr, languageSaveRes) {
						// Handle Language save error
						if (languageSaveErr) done(languageSaveErr);

						// Delete existing Language
						agent.delete('/languages/' + languageSaveRes.body._id)
							.send(language)
							.expect(200)
							.end(function(languageDeleteErr, languageDeleteRes) {
								// Handle Language error error
								if (languageDeleteErr) done(languageDeleteErr);

								// Set assertions
								(languageDeleteRes.body._id).should.equal(languageSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Language instance if not signed in', function(done) {
		// Set Language user 
		language.user = user;

		// Create new Language model instance
		var languageObj = new Language(language);

		// Save the Language
		languageObj.save(function() {
			// Try deleting Language
			request(app).delete('/languages/' + languageObj._id)
			.expect(401)
			.end(function(languageDeleteErr, languageDeleteRes) {
				// Set message assertion
				(languageDeleteRes.body.message).should.match('User is not logged in');

				// Handle Language error error
				done(languageDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Language.remove().exec();
		done();
	});
});