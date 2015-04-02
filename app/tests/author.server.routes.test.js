'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Author = mongoose.model('Author'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, author;

/**
 * Author routes tests
 */
describe('Author CRUD tests', function() {
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

		// Save a user to the test db and create new Author
		user.save(function() {
			author = {
				name: 'Author Name'
			};

			done();
		});
	});

	it('should be able to save Author instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Author
				agent.post('/authors')
					.send(author)
					.expect(200)
					.end(function(authorSaveErr, authorSaveRes) {
						// Handle Author save error
						if (authorSaveErr) done(authorSaveErr);

						// Get a list of Authors
						agent.get('/authors')
							.end(function(authorsGetErr, authorsGetRes) {
								// Handle Author save error
								if (authorsGetErr) done(authorsGetErr);

								// Get Authors list
								var authors = authorsGetRes.body;

								// Set assertions
								(authors[0].user._id).should.equal(userId);
								(authors[0].name).should.match('Author Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Author instance if not logged in', function(done) {
		agent.post('/authors')
			.send(author)
			.expect(401)
			.end(function(authorSaveErr, authorSaveRes) {
				// Call the assertion callback
				done(authorSaveErr);
			});
	});

	it('should not be able to save Author instance if no name is provided', function(done) {
		// Invalidate name field
		author.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Author
				agent.post('/authors')
					.send(author)
					.expect(400)
					.end(function(authorSaveErr, authorSaveRes) {
						// Set message assertion
						(authorSaveRes.body.message).should.match('Please fill Author name');
						
						// Handle Author save error
						done(authorSaveErr);
					});
			});
	});

	it('should be able to update Author instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Author
				agent.post('/authors')
					.send(author)
					.expect(200)
					.end(function(authorSaveErr, authorSaveRes) {
						// Handle Author save error
						if (authorSaveErr) done(authorSaveErr);

						// Update Author name
						author.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Author
						agent.put('/authors/' + authorSaveRes.body._id)
							.send(author)
							.expect(200)
							.end(function(authorUpdateErr, authorUpdateRes) {
								// Handle Author update error
								if (authorUpdateErr) done(authorUpdateErr);

								// Set assertions
								(authorUpdateRes.body._id).should.equal(authorSaveRes.body._id);
								(authorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Authors if not signed in', function(done) {
		// Create new Author model instance
		var authorObj = new Author(author);

		// Save the Author
		authorObj.save(function() {
			// Request Authors
			request(app).get('/authors')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Author if not signed in', function(done) {
		// Create new Author model instance
		var authorObj = new Author(author);

		// Save the Author
		authorObj.save(function() {
			request(app).get('/authors/' + authorObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', author.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Author instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Author
				agent.post('/authors')
					.send(author)
					.expect(200)
					.end(function(authorSaveErr, authorSaveRes) {
						// Handle Author save error
						if (authorSaveErr) done(authorSaveErr);

						// Delete existing Author
						agent.delete('/authors/' + authorSaveRes.body._id)
							.send(author)
							.expect(200)
							.end(function(authorDeleteErr, authorDeleteRes) {
								// Handle Author error error
								if (authorDeleteErr) done(authorDeleteErr);

								// Set assertions
								(authorDeleteRes.body._id).should.equal(authorSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Author instance if not signed in', function(done) {
		// Set Author user 
		author.user = user;

		// Create new Author model instance
		var authorObj = new Author(author);

		// Save the Author
		authorObj.save(function() {
			// Try deleting Author
			request(app).delete('/authors/' + authorObj._id)
			.expect(401)
			.end(function(authorDeleteErr, authorDeleteRes) {
				// Set message assertion
				(authorDeleteRes.body.message).should.match('User is not logged in');

				// Handle Author error error
				done(authorDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Author.remove().exec();
		done();
	});
});