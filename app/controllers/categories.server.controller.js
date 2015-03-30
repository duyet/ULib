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
var category = require('../models/category.server.model');

/**
 * Create a Category
 */
exports.create = function(req, res) {
	req.assert('name', 'Category name is empty.').notEmpty();

	var err = req.validationErrors();
	if (err) {
		return res.status(400).send({message: err});
	}

	var categoryName = req.body.name || '';
	var description = req.body.description || '';
	var loanTime = req.body.loan_time || 15;

	new category({name:categoryName, description:description, loan_time:loanTime}).save().then(function(model) { 
		res.jsonp(model);
	}).error(function(err) { 
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	})
};


/**
 * Show the current Category
 */
exports.read = function(req, res) {
	console.log('Reading...');
	res.jsonp(req.category);
};

/**
 * Update a Category
 */
exports.update = function(req, res) {
	var category = req.category ;

	category = _.extend(category , req.body);

	category.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(category);
		}
	});
};

/**
 * Delete an Category
 */
exports.delete = function(req, res) {
	var category = req.category ;

	category.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(category);
		}
	});
};

/**
 * List of Categories
 */
exports.list = function(req, res) { 
	new category({status:1}).fetchAll().then(function(categories){ 
		res.jsonp(categories);
	}).error(function(err) { 
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * Category middleware
 */
exports.categoryByID = function(req, res, next, id) { 
	new category({id:id}).fetch().then(function(cat) { 
		if (! cat) return next(new Error('Failed to load Category ' + id));

		req.category = cat;
		next();
	}).error(function(err) {
		console.log('Not found category!');
		return next(err);
	});
};

/**
 * Category authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
