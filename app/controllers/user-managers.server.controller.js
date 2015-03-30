'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');
var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));

var errorHandler = require('./errors.server.controller');
var config = require('../../config/config');
var staff = require('../models/staff.server.model');
var async = require('async');

/**
 * Create a User manager
 */
exports.create = function(req, res) {

	req.assert('username', 'Username is empty.').notEmpty();
	req.assert('password', 'Password is empty.').notEmpty();
	req.assert('email', 'Invalid email.').notEmpty().isEmail();

	var err = req.validationErrors();
	if (err) {
		return res.status(400).send({message: err});
	}

	var name = req.body.name || '';
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

					res.jsonp(new_staff.attributes);

				})
				.catch(function(e) {
					console.error(e);
					res.status(400).send({message: 'Error when save, please try again later!'});
				});
			});
		}
	});


};

/**
 * Show the current User manager
 */
exports.read = function(req, res) {
	console.log('Reading user data ...', req.userManager);
	res.jsonp(req.userManager);
};

/**
 * Update a User manager
 */
exports.update = function(req, res) {
	var userManager = req.userManager ;

	userManager = _.extend(userManager , req.body);

	if (userManager.password && userManager.password != "") { 
		userManager.password = bcrypt.hashSync(userManager.password, 8);
	}

	new staff({id: userManager.id}).save(userManager, {patch: true}).then(function(model) { 
		res.jsonp(userManager);
	}).error(function(err) { 
		console.log(err);
		return res.status(400).send({message: err});
	})


	/*
	userManager.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userManager);
		}
	});
	*/
};

/**
 * Delete an User manager
 */
exports.delete = function(req, res) {
	var userManager = req.userManager;

	new staff({id:userManager.id}).destroy().then(function() { 
		res.jsonp(userManager);
	}).error(function(err) { 
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * List of User managers
 */
exports.list = function(req, res) { 
	new staff().fetchAll().then(function(userManagers){ 
		res.jsonp(userManagers);
	}).error(function(err) { 
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * User manager middleware
 */
exports.userManagerByID = function(req, res, next, id) { 
	return new staff({id:id}).fetch().then(function(userManager) { 
		if (! userManager) return next(new Error('Failed to load User manager ' + id));
		req.userManager = userManager ;
		next();
	}).error(function(err) { 
		return next(err);
	});
};

/**
 * User manager authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	//if (req.userManager.user.id !== req.user.id) {
	//		return res.status(403).send('User is not authorized');
	//}
	next();
};
