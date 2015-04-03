'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Servicelog = mongoose.model('Servicelog'),
	_ = require('lodash');

/**
 * Create a Servicelog
 */
exports.create = function(req, res) {
	var servicelog = new Servicelog(req.body);
	servicelog.user = req.user;

	servicelog.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(servicelog);
		}
	});
};

/**
 * Show the current Servicelog
 */
exports.read = function(req, res) {
	res.jsonp(req.servicelog);
};

/**
 * Update a Servicelog
 */
exports.update = function(req, res) {
	var servicelog = req.servicelog ;

	servicelog = _.extend(servicelog , req.body);

	servicelog.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(servicelog);
		}
	});
};

/**
 * Delete an Servicelog
 */
exports.delete = function(req, res) {
	var servicelog = req.servicelog ;

	servicelog.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(servicelog);
		}
	});
};

/**
 * List of Servicelogs
 */
exports.list = function(req, res) { 
	Servicelog.find().sort('-created').populate('user', 'displayName').exec(function(err, servicelogs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(servicelogs);
		}
	});
};

/**
 * Servicelog middleware
 */
exports.servicelogByID = function(req, res, next, id) { 
	Servicelog.findById(id).populate('user', 'displayName').exec(function(err, servicelog) {
		if (err) return next(err);
		if (! servicelog) return next(new Error('Failed to load Servicelog ' + id));
		req.servicelog = servicelog ;
		next();
	});
};

/**
 * Servicelog authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.servicelog.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
