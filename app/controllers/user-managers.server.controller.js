'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	UserManager = mongoose.model('UserManager'),
	_ = require('lodash');

/**
 * Create a User manager
 */
exports.create = function(req, res) {
	var userManager = new UserManager(req.body);
	userManager.user = req.user;

	userManager.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userManager);
		}
	});
};

/**
 * Show the current User manager
 */
exports.read = function(req, res) {
	res.jsonp(req.userManager);
};

/**
 * Update a User manager
 */
exports.update = function(req, res) {
	var userManager = req.userManager ;

	userManager = _.extend(userManager , req.body);

	userManager.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userManager);
		}
	});
};

/**
 * Delete an User manager
 */
exports.delete = function(req, res) {
	var userManager = req.userManager ;

	userManager.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userManager);
		}
	});
};

/**
 * List of User managers
 */
exports.list = function(req, res) { 
	UserManager.find().sort('-created').populate('user', 'displayName').exec(function(err, userManagers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userManagers);
		}
	});
};

/**
 * User manager middleware
 */
exports.userManagerByID = function(req, res, next, id) { 
	UserManager.findById(id).populate('user', 'displayName').exec(function(err, userManager) {
		if (err) return next(err);
		if (! userManager) return next(new Error('Failed to load User manager ' + id));
		req.userManager = userManager ;
		next();
	});
};

/**
 * User manager authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.userManager.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
