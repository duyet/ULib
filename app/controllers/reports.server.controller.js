'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));
var async = require('async');

var errorHandler = require('./errors.server.controller');
var config = require('../../config/config');
//var PublisherModel = require('../models/publisher.server.model');
var connection = config.connection;

exports.all = function(req, res) {
	res.json([]);
};

exports.categories = function(req, res) {
	connection.query('CALL `ReportCategories`();', [], function(err, result) {
	    if (err) {
	        connection.rollback(function() {
	            throw err;

	            return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
	        });
	    }

	    res.jsonp(result[0] || []);
	});
};

exports.books = function(req, res) {
	connection.query('CALL `ReportBooks`();', [], function(err, result) {
	    if (err) {
	        connection.rollback(function() {
	            throw err;

	            return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
	        });
	    }

	    res.jsonp(result[0] || []);
	});
};

/**
 * Report middleware
 */
exports.reportByID = function(req, res, next, id) { 
	Report.findById(id).populate('user', 'displayName').exec(function(err, report) {
		if (err) return next(err);
		if (! report) return next(new Error('Failed to load Report ' + id));
		req.report = report ;
		next();
	});
};

/**
 * Report authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.report.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
