'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');
var passport = require('passport');
var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));
var crypto	= require('crypto');
var nodemailer = require('nodemailer');
var async = require('async');

var errorHandler = require('./errors.server.controller');
var config = require('../../config/config');
var connection = config.connection;
var PublisherModel = require('../models/publisher.server.model');

/**
 * Create a Publisher
 */
exports.create = function(req, res) {
	req.assert('name', 'Publisher name is empty.').notEmpty();

	var err = req.validationErrors();
	if (err) {
		return res.status(400).send({message: err});
	}

	var publisherName = req.body.name || '';
	var description = req.body.description || '';

	new PublisherModel({name:publisherName.trim(), description:description.trim()}).save().then(function(model) { 
		res.jsonp(model);
	}).error(function(err) { 
		console.log(err);
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	})
};


/**
 * Show the current Publisher
 */
exports.read = function(req, res) {
	res.jsonp(req.publisher);
};

/**
 * Update a Publisher
 */
exports.update = function(req, res) {
	var is_lock_mode = true;
	var lock_mode = is_lock_mode ? 'LOCK IN SHARE MODE' : '';
	var delay = req.body.debug ? 10 : 0;
	var timeout = delay > 0 ? 0 : 1000;

	console.log('timeout is ' + timeout);

	var publisher = req.publisher.attributes;

	publisher.description = req.body.description;
	publisher.name = req.body.name;

	connection.query('SELECT SLEEP(?)', [delay], function() {
		connection.query('SELECT COUNT(*) FROM `Publishers` WHERE `publisher_id` = ? ' + lock_mode, 
		[publisher.publisher_id], 
		function(err, results) {
			connection.query({sql: 'UPDATE Publishers SET `name` = ?, `description` = ? WHERE `publisher_id` = ?', timeout: timeout}, 
			[publisher.name, publisher.description, publisher.publisher_id], 
			function(err, results) {
				if (!delay) {
					return res.status(400).send({
						message: 'Can not update, please refresh and try again later'
					});
				}

				res.jsonp(results);
			});
		})
	})
};

/**
 * Delete an Publisher
 */
exports.delete = function(req, res) {
	console.log(req.publisher);

	new PublisherModel({publisher_id:req.publisher.publisher_id}).fetch().then(function(model) {
		model.destroy().then(function() {
			res.jsonp(model);
		});
	}).otherwise(function(err) {
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * List of Publisher
 */
exports.list = function(req, res) { 
	new PublisherModel().fetchAll().then(function(publisher){ 
		res.jsonp(publisher);
	}).error(function(err) { 
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * Publisher middleware
 */
exports.publisherByID = function(req, res, next, id) { 
	new PublisherModel({publisher_id:id}).fetch().then(function(publisher) { 
		if (! publisher) return next(new Error('Failed to load publisher ' + id));

		req.publisher = publisher;
		next();
	}).error(function(err) {
		console.log('Not found publisher!');
		return next(err);
	});
};

/**
 * Publisher authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
