'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Student = mongoose.model('Student'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, student;

/**
 * Student routes tests
 */
describe('Student CRUD tests', function() {
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

		// Save a user to the test db and create new Student
		user.save(function() {
			student = {
				name: 'Student Name'
			};

			done();
		});
	});

	it('should be able to save Student instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Student
				agent.post('/students')
					.send(student)
					.expect(200)
					.end(function(studentSaveErr, studentSaveRes) {
						// Handle Student save error
						if (studentSaveErr) done(studentSaveErr);

						// Get a list of Students
						agent.get('/students')
							.end(function(studentsGetErr, studentsGetRes) {
								// Handle Student save error
								if (studentsGetErr) done(studentsGetErr);

								// Get Students list
								var students = studentsGetRes.body;

								// Set assertions
								(students[0].user._id).should.equal(userId);
								(students[0].name).should.match('Student Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Student instance if not logged in', function(done) {
		agent.post('/students')
			.send(student)
			.expect(401)
			.end(function(studentSaveErr, studentSaveRes) {
				// Call the assertion callback
				done(studentSaveErr);
			});
	});

	it('should not be able to save Student instance if no name is provided', function(done) {
		// Invalidate name field
		student.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Student
				agent.post('/students')
					.send(student)
					.expect(400)
					.end(function(studentSaveErr, studentSaveRes) {
						// Set message assertion
						(studentSaveRes.body.message).should.match('Please fill Student name');
						
						// Handle Student save error
						done(studentSaveErr);
					});
			});
	});

	it('should be able to update Student instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Student
				agent.post('/students')
					.send(student)
					.expect(200)
					.end(function(studentSaveErr, studentSaveRes) {
						// Handle Student save error
						if (studentSaveErr) done(studentSaveErr);

						// Update Student name
						student.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Student
						agent.put('/students/' + studentSaveRes.body._id)
							.send(student)
							.expect(200)
							.end(function(studentUpdateErr, studentUpdateRes) {
								// Handle Student update error
								if (studentUpdateErr) done(studentUpdateErr);

								// Set assertions
								(studentUpdateRes.body._id).should.equal(studentSaveRes.body._id);
								(studentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Students if not signed in', function(done) {
		// Create new Student model instance
		var studentObj = new Student(student);

		// Save the Student
		studentObj.save(function() {
			// Request Students
			request(app).get('/students')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Student if not signed in', function(done) {
		// Create new Student model instance
		var studentObj = new Student(student);

		// Save the Student
		studentObj.save(function() {
			request(app).get('/students/' + studentObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', student.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Student instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Student
				agent.post('/students')
					.send(student)
					.expect(200)
					.end(function(studentSaveErr, studentSaveRes) {
						// Handle Student save error
						if (studentSaveErr) done(studentSaveErr);

						// Delete existing Student
						agent.delete('/students/' + studentSaveRes.body._id)
							.send(student)
							.expect(200)
							.end(function(studentDeleteErr, studentDeleteRes) {
								// Handle Student error error
								if (studentDeleteErr) done(studentDeleteErr);

								// Set assertions
								(studentDeleteRes.body._id).should.equal(studentSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Student instance if not signed in', function(done) {
		// Set Student user 
		student.user = user;

		// Create new Student model instance
		var studentObj = new Student(student);

		// Save the Student
		studentObj.save(function() {
			// Try deleting Student
			request(app).delete('/students/' + studentObj._id)
			.expect(401)
			.end(function(studentDeleteErr, studentDeleteRes) {
				// Set message assertion
				(studentDeleteRes.body.message).should.match('User is not logged in');

				// Handle Student error error
				done(studentDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Student.remove().exec();
		done();
	});
});