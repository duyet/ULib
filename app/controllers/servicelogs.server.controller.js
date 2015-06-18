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
var ServicelogModel = require('../models/servicelog.server.model');

/**
 * Create a Service
 */
exports.create = function(req, res) {
	req.assert('service_id', 'Service is empty.').notEmpty();
	req.assert('prices', 'Prices is wrong.').notEmpty().isInt();

	var err = req.validationErrors();
	if (err) {
		return res.status(400).send({message: err});
	}

	var service_id = req.body.service_id || 0;
	var staff_id = req.user.id || 0;
	var prices = req.body.prices || 0;
	var note = req.body.note || '';

	if (service_id == 0) {
		return res.status(400).send({message: 'Please select service type.'});
	}

	new ServicelogModel({
		service_id: service_id,
		staff_id: staff_id, 
		prices: prices,
		note: note
	}).save().then(function(model) { 
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
	res.jsonp(req.servicelog);
};

/**
 * Update a Service
 */
exports.update = function(req, res) {
	var servicelog = req.servicelog.attributes;

	servicelog.description = req.body.description;
	servicelog.name = req.body.name;

	console.log('Update servicelog with data:', servicelog);

	new ServicelogModel({id:req.servicelog.id}).save(servicelog).then(function(model) {
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
	console.log(req.servicelog);

	new ServicelogModel({id:req.servicelog.id}).fetch().then(function(model) {
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
	new ServicelogModel({status:1}).fetchAll({withRelated: ['staff', 'service']}).then(function(servicelog){ 
		res.jsonp(servicelog);
	}).error(function(err) { 
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * Service middleware
 */
exports.servicelogByID = function(req, res, next, id) { 
	new ServicelogModel({id:id}).fetch({withRelated: ['staff', 'service']}).then(function(servicelog) { 
		if (! servicelog) return next(new Error('Failed to load servicelog ' + id));

		req.servicelog = servicelog;
		next();
	}).error(function(err) {
		console.log('Not found servicelog!');
		return next(err);
	});
};

/**
 * Service authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
