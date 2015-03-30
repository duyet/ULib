'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Category = mongoose.model('Category'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, category;

/**
 * Category routes tests
 */
describe('Category CRUD tests', function() {
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

		// Save a user to the test db and create new Category
		user.save(function() {
			category = {
				name: 'Category Name'
			};

			done();
		});
	});

	it('should be able to save Category instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Category
				agent.post('/categories')
					.send(category)
					.expect(200)
					.end(function(categorySaveErr, categorySaveRes) {
						// Handle Category save error
						if (categorySaveErr) done(categorySaveErr);

						// Get a list of Categories
						agent.get('/categories')
							.end(function(categoriesGetErr, categoriesGetRes) {
								// Handle Category save error
								if (categoriesGetErr) done(categoriesGetErr);

								// Get Categories list
								var categories = categoriesGetRes.body;

								// Set assertions
								(categories[0].user._id).should.equal(userId);
								(categories[0].name).should.match('Category Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Category instance if not logged in', function(done) {
		agent.post('/categories')
			.send(category)
			.expect(401)
			.end(function(categorySaveErr, categorySaveRes) {
				// Call the assertion callback
				done(categorySaveErr);
			});
	});

	it('should not be able to save Category instance if no name is provided', function(done) {
		// Invalidate name field
		category.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Category
				agent.post('/categories')
					.send(category)
					.expect(400)
					.end(function(categorySaveErr, categorySaveRes) {
						// Set message assertion
						(categorySaveRes.body.message).should.match('Please fill Category name');
						
						// Handle Category save error
						done(categorySaveErr);
					});
			});
	});

	it('should be able to update Category instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Category
				agent.post('/categories')
					.send(category)
					.expect(200)
					.end(function(categorySaveErr, categorySaveRes) {
						// Handle Category save error
						if (categorySaveErr) done(categorySaveErr);

						// Update Category name
						category.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Category
						agent.put('/categories/' + categorySaveRes.body._id)
							.send(category)
							.expect(200)
							.end(function(categoryUpdateErr, categoryUpdateRes) {
								// Handle Category update error
								if (categoryUpdateErr) done(categoryUpdateErr);

								// Set assertions
								(categoryUpdateRes.body._id).should.equal(categorySaveRes.body._id);
								(categoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Categories if not signed in', function(done) {
		// Create new Category model instance
		var categoryObj = new Category(category);

		// Save the Category
		categoryObj.save(function() {
			// Request Categories
			request(app).get('/categories')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Category if not signed in', function(done) {
		// Create new Category model instance
		var categoryObj = new Category(category);

		// Save the Category
		categoryObj.save(function() {
			request(app).get('/categories/' + categoryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', category.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Category instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Category
				agent.post('/categories')
					.send(category)
					.expect(200)
					.end(function(categorySaveErr, categorySaveRes) {
						// Handle Category save error
						if (categorySaveErr) done(categorySaveErr);

						// Delete existing Category
						agent.delete('/categories/' + categorySaveRes.body._id)
							.send(category)
							.expect(200)
							.end(function(categoryDeleteErr, categoryDeleteRes) {
								// Handle Category error error
								if (categoryDeleteErr) done(categoryDeleteErr);

								// Set assertions
								(categoryDeleteRes.body._id).should.equal(categorySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Category instance if not signed in', function(done) {
		// Set Category user 
		category.user = user;

		// Create new Category model instance
		var categoryObj = new Category(category);

		// Save the Category
		categoryObj.save(function() {
			// Try deleting Category
			request(app).delete('/categories/' + categoryObj._id)
			.expect(401)
			.end(function(categoryDeleteErr, categoryDeleteRes) {
				// Set message assertion
				(categoryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Category error error
				done(categoryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Category.remove().exec();
		done();
	});
});