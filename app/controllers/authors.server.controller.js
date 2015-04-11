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
var authorModel = require('../models/author.server.model');

/**
 * Create a Author
 */
exports.create = function(req, res) {
	req.assert('name', 'Author name is empty.').notEmpty();

	var err = req.validationErrors();
	if (err) {
		return res.status(400).send({message: err});
	}

	var authorName = req.body.name || '';
	var description = req.body.description || '';

	new authorModel({name:authorName.trim(), description:description.trim()}).save().then(function(model) { 
		res.jsonp(model);
	}).error(function(err) { 
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	})
};


/**
 * Show the current Author
 */
exports.read = function(req, res) {
	if (!req.author) {
		return res.status(400).send({message: 'Not found!'});
	}

	res.jsonp(req.author);
};

/**
 * Update a Author
 */
exports.update = function(req, res) {
	var author = req.author.attributes;

	author.description = req.body.description;
	author.name = req.body.name;

	console.log('Update author with data:', author);

	new authorModel({id:req.author.id}).save(author).then(function(model) {
		res.jsonp(model);
	}).error(function(err) {
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * Delete an Author
 */
exports.delete = function(req, res) {
	console.log('Delete author: ', req.author.id);
	new authorModel({id: req.author.id}).fetch().then(function(model) {
		model.destroy().then(function() {
			res.jsonp({message: 'Delete success'});
		});
	}).otherwise(function(err) {
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * List of Authors
 */
exports.list = function(req, res) { 
	new authorModel({status:1}).fetchAll().then(function(authors){ 
		res.jsonp(authors);
	}).error(function(err) { 
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * Author middleware
 */
exports.authorByID = function(req, res, next, id) { 
	new authorModel({id:id}).fetch().then(function(model) { 
		if (! model) {
			return res.status(400).send({message: 'Not found!'});
		}

		req.author = model;
		next();
	}).error(function(err) {
		console.log('Not found!');
		return next(err);
	});
};

/**
 * Author authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
