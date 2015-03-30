'use strict';

var _ = require('lodash');
var passport = require('passport');
var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));
var crypto	= require('crypto');
var nodemailer = require('nodemailer');
var async = require('async');

var errorHandler = require('./errors.server.controller');
var config = require('../../config/config');
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

	req.assert('username', 'Username is empty.').notEmpty();
	req.assert('password', 'Password is empty.').notEmpty();

	var err = req.validationErrors();
	if (err) {
		return res.status(400).send({message: err});
	}

	console.log(req.body);

	passport.authenticate('local-login', function(err, user, info) {
		if (err) { return next(err); }
		
		if (!user) {
			return res.status(400).send({message: req.flash('loginMessage')});
		}
		
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			//return res.redirect('/users/' + user.username);
			res.json(user);
		});
	})(req, res, next);

	/*
	var staffLogin = new staff();
	staffLogin.login(username, password).then(function(staff_user) {
		// Login success
		//res.json(staff_user.omit('password'));
		if (staff_user) {
			req.login(staff_user, function(err) {
				if (err) {
					res.status(400).send({message:err});
				} else {
					res.json(staff_user);
				}
			});	
		}
  	}).catch(staff.NotFoundError, function() {
		res.json(400, {message: req.body.username + ' not found'});
	}).catch(function(err) {
		res.status(400).send({message: 'Password was wrong!'});
		console.error(err);
	});

*/
};

exports.signup = function(req, res, next) {

	req.assert('username', 'Username is empty.').notEmpty();
	req.assert('password', 'Password is empty.').notEmpty();
	req.assert('email', 'Invalid email.').notEmpty().isEmail();

	var err = req.validationErrors();
	if (err) {
		return res.status(400).send({message: err});
	}

	var name = req.body.yourName || '';
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

	new staff({username: username}).fetch().then(function(user) {
		console.log(user);
		if (user) {
			// This username aldready exists.
			return res.status(400).send({message: 'User aldready exists!'});
		} else {
			// Register new user
			
			// TODO: missing name on db, fix later
			bcrypt.hash(password, 8, function(err, hash) {
				new staff({username: username.toLowerCase().trim(), email: email, name: name.trim(), password:hash}).save({}, {isNew:true})
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
				})
				.catch(function(e) {
					console.error(e);
					res.status(400).send({message: 'Error when save, please try again later!'});
				});
			});
		}
	});

};

exports.signout = function(req, res, next) {
	if(req.isAuthenticated()){
		req.logout();
	}

	res.redirect('/');
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

/**
 * Send User
 */

exports.me = function(req, res) {
	res.json(req.user || null);
};

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	console.log(req);

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);

		console.log("Update user profile...");
		console.log(user);

		new staff(user).save().then(function(model) {
			return res.json(model);
		}).catch(function(err) {
			console.log(err);

			return res.status(400).send({
				message: 'Cannot save, please try again!'
			});
		});

		/*
		user.save(function(err) {
			if (err) {
				
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
		*/

	} else {
		res.status(400).send({
			message: 'User is not signed in!'
		});
	}
};


/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function(req, res, next) {
	/*
	async.waterfall([
		// Generate random token
		function(done) {
			crypto.randomBytes(20, function(err, buffer) {
				var token = buffer.toString('hex');
				done(err, token);
			});
		},
		// Lookup user by username
		function(token, done) {
			if (req.body.username) {
				User.findOne({
					username: req.body.username
				}, '-salt -password', function(err, user) {
					if (!user) {
						return res.status(400).send({
							message: 'No account with that username has been found'
						});
					} else if (user.provider !== 'local') {
						return res.status(400).send({
							message: 'It seems like you signed up using your ' + user.provider + ' account'
						});
					} else {
						user.resetPasswordToken = token;
						user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

						user.save(function(err) {
							done(err, token, user);
						});
					}
				});
			} else {
				return res.status(400).send({
					message: 'Username field must not be blank'
				});
			}
		},
		function(token, user, done) {
			res.render('templates/reset-password-email', {
				name: user.displayName,
				appName: config.app.title,
				url: 'http://' + req.headers.host + '/auth/reset/' + token
			}, function(err, emailHTML) {
				done(err, emailHTML, user);
			});
		},
		// If valid email, send reset email using service
		function(emailHTML, user, done) {
			var smtpTransport = nodemailer.createTransport(config.mailer.options);
			var mailOptions = {
				to: user.email,
				from: config.mailer.from,
				subject: 'Password Reset',
				html: emailHTML
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				if (!err) {
					res.send({
						message: 'An email has been sent to ' + user.email + ' with further instructions.'
					});
				}

				done(err);
			});
		}
	], function(err) {
		if (err) return next(err);
	});
*/
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function(req, res) {
/*
	User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: {
			$gt: Date.now()
		}
	}, function(err, user) {
		if (!user) {
			return res.redirect('/#!/password/reset/invalid');
		}

		res.redirect('/#!/password/reset/' + req.params.token);
	});
*/	
};

/**
 * Reset password POST from email token
 */
exports.reset = function(req, res, next) {
	// Init Variables
	var passwordDetails = req.body;

	async.waterfall([

		function(done) {
			User.findOne({
				resetPasswordToken: req.params.token,
				resetPasswordExpires: {
					$gt: Date.now()
				}
			}, function(err, user) {
				if (!err && user) {
					if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
						user.password = passwordDetails.newPassword;
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;

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
										// Return authenticated user 
										res.json(user);

										done(err, user);
									}
								});
							}
						});
					} else {
						return res.status(400).send({
							message: 'Passwords do not match'
						});
					}
				} else {
					return res.status(400).send({
						message: 'Password reset token is invalid or has expired.'
					});
				}
			});
		},
		function(user, done) {
			res.render('templates/reset-password-confirm-email', {
				name: user.displayName,
				appName: config.app.title
			}, function(err, emailHTML) {
				done(err, emailHTML, user);
			});
		},
		// If valid email, send reset email using service
		function(emailHTML, user, done) {
			var smtpTransport = nodemailer.createTransport(config.mailer.options);
			var mailOptions = {
				to: user.email,
				from: config.mailer.from,
				subject: 'Your password has been changed',
				html: emailHTML
			};

			smtpTransport.sendMail(mailOptions, function(err) {
				done(err, 'done');
			});
		}
	], function(err) {
		if (err) return next(err);
	});
};

/**
 * Change Password
 */
exports.changePassword = function(req, res) {
	// Init Variables
	var passwordDetails = req.body;

	if (req.user) {
		if (passwordDetails.newPassword) {
			staff.
			User.findById(req.user.id, function(err, user) {
				if (!err && user) {
					if (user.authenticate(passwordDetails.currentPassword)) {
						if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
							user.password = passwordDetails.newPassword;

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
											res.send({
												message: 'Password changed successfully'
											});
										}
									});
								}
							});
						} else {
							res.status(400).send({
								message: 'Passwords do not match'
							});
						}
					} else {
						res.status(400).send({
							message: 'Current password is incorrect'
						});
					}
				} else {
					res.status(400).send({
						message: 'User is not found'
					});
				}
			});
		} else {
			res.status(400).send({
				message: 'Please provide a new password'
			});
		}
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};