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
var languageModel = require('../models/language.server.model');

/**
 * Create a Language
 */
exports.create = function(req, res) {
	req.assert('name', 'Language name is empty.').notEmpty();

	var err = req.validationErrors();
	if (err) {
		return res.status(400).send({message: err});
	}

	var languageName = req.body.name || '';
	var description = req.body.description || '';

	new languageModel({name:languageName.trim(), description:description.trim()}).save().then(function(model) { 
		res.jsonp(model);
	}).error(function(err) { 
		console.log(err);
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	})
};


/**
 * Show the current Language
 */
exports.read = function(req, res) {
	res.jsonp(req.language);
};

/**
 * Update a Language
 */
exports.update = function(req, res) {
	var language = req.language.attributes;

	language.description = req.body.description;
	language.name = req.body.name;

	console.log('Update language with data:', language);

	new languageModel({id:req.language.id}).save(language).then(function(model) {
		res.jsonp(model);
	}).error(function(err) {
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * Delete an Language
 */
exports.delete = function(req, res) {
	console.log(req.language);

	new languageModel({id:req.language.id}).fetch().then(function(model) {
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
 * List of Language
 */
exports.list = function(req, res) { 
	new languageModel({status:1}).fetchAll().then(function(language){ 
		res.jsonp(language);
	}).error(function(err) { 
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * Language middleware
 */
exports.languageByID = function(req, res, next, id) { 
	new languageModel({id:id, status: 1}).fetch().then(function(language) { 
		if (! language) return next(new Error('Failed to load language ' + id));

		req.language = language;
		next();
	}).error(function(err) {
		console.log('Not found language!');
		return next(err);
	});
};

/**
 * Language authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
