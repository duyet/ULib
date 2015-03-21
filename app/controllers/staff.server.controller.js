'use strict';

var passport = require('passport');
var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));

var staff = require('../models/staff.server.model');

/**
 * Create a article
 */
exports.index = function(req, res) {
	res.json(staff.fetchAll());
};

exports.signin = function(req, res, next) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	console.log(req.body);

	staff.login(req.body.username, req.body.password).then(function(staff_user) {
		// Login success
		//res.json(staff_user.omit('password'));
		req.login(staff_user, function(err) {
			if (err) {
				res.status(400).send({message:err});
			} else {
				res.json(staff_user);
			}
		});

  	}).catch(staff.NotFoundError, function() {
		res.json(400, {message: req.body.username + ' not found'});
	}).catch(function(err) {
		res.status(400).send({message: 'Username and password are both required'});
		console.error(err);
	});
};

exports.signup = function(req, res, next) {
	var name = req.body.yourName;
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;

	// Check username
	if (!username || username.length < 5) {
		return res.status(400).json({message: 'Username length must be >= 5.'});
	}

	// Check password
	if (!password || password.length < 5) {
		return res.status(400).json({message: 'Password length must be >= 5.'});
	}	

	new staff({email: email}).fetch().then(function(user) {
		console.log(user);
		if (user) {
			// This username aldready exists.
			return res.status(400).send({message: 'User aldready exists!'});
		} else {
			// Register new user
			
			// TODO: missing name on db, fix later
			
			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(password, salt, function(err, hash) {
					 new staff({username: username.toLowerCase().trim(), email: email, password:hash}).save({}, {isNew:true})
					.catch(function(e) {
						console.error('Error when save!');
					})
					.then(function(new_staff) {
						console.log('Add new staff success!', new_staff.attributes);

						// Login
						req.login(new_staff.attributes, function(err) {
							if (err) {
								res.status(400).send(err);
							} else {
								res.json(new_staff.attributes);
							}
						});
					});	
				});
			});

		}
	});
}

exports.signout = function(req, res, next) {
	req.logout();
	res.redirect('/');
}

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};
