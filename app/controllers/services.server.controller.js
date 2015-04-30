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
var ServiceModel = require('../models/service.server.model');

/**
 * Create a Service
 */
exports.create = function(req, res) {
	req.assert('name', 'Service name is empty.').notEmpty();

	var err = req.validationErrors();
	if (err) {
		return res.status(400).send({message: err});
	}

	var serviceName = req.body.name || '';
	var description = req.body.description || '';

	new ServiceModel({name:serviceName.trim(), description:description.trim()}).save().then(function(model) { 
		res.jsonp(model);
	}).error(function(err) { 
		console.log(err);
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	})
};


/**
 * Show the current Service
 */
exports.read = function(req, res) {
	res.jsonp(req.service);
};

/**
 * Update a Service
 */
exports.update = function(req, res) {
	var service = req.service.attributes;

	service.description = req.body.description;
	service.name = req.body.name;

	console.log('Update service with data:', service);

	new ServiceModel({id:req.service.id}).save(service).then(function(model) {
		res.jsonp(model);
	}).error(function(err) {
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * Delete an Service
 */
exports.delete = function(req, res) {
	console.log(req.service);

	new ServiceModel({id:req.service.id}).fetch().then(function(model) {
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
 * List of Service
 */
exports.list = function(req, res) { 
	new ServiceModel({status:1}).fetchAll().then(function(service){ 
		res.jsonp(service);
	}).error(function(err) { 
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * Service middleware
 */
exports.serviceByID = function(req, res, next, id) { 
	new ServiceModel({id:id}).fetch().then(function(service) { 
		if (! service) return next(new Error('Failed to load service ' + id));

		req.service = service;
		next();
	}).error(function(err) {
		console.log('Not found service!');
		return next(err);
	});
};

/**
 * Service authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
