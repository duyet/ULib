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
var path = require('path');

var errorHandler = require('./errors.server.controller');
var config = require('../../config/config');
var categoryModel = require('../models/category.server.model');

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

	new categoryModel({name:categoryName.trim(), description:description.trim(), loan_time:loanTime}).save().then(function(model) { 
		res.jsonp(model);
	}).error(function(err) { 
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	})
};

/** 
 * Import 
 */
exports.importCategories = function(req, res) {
	var data = _.pick(req.body, 'type'), 
    file = req.files.file;

	console.log(data); //original name (ie: sunset.png)
	console.log(file); //tmp path (ie: /tmp/12345-xyaz.png)

	var dataImport = false;

	// Xls file 
	if (path.extname(file.path) == '.xls' || path.extname(file.path) == '.xlsx' || path.extname(file.path) == '.csv') {
		dataImport = require('xlsjs').readFile(file.path);	

		console.log(dataImport);

		if (dataImport.error) {
			return res.status(400).send({message: 'Import file error!'});
		}

		var sheet_name_list = dataImport.SheetNames;
		var Sheet1 = dataImport.Sheets[sheet_name_list[0]];

		console.log(Sheet1);
	}
	//console.log(dataImport);


}

/**
 * Show the current Category
 */
exports.read = function(req, res) {
	res.jsonp(req.category);
};

/**
 * Update a Category
 */
exports.update = function(req, res) {
	var category = req.category.attributes;

	category.description = req.body.description;
	category.loan_time = req.body.loan_time;
	category.name = req.body.name;

	console.log('Update category with data:', category);

	new categoryModel({id:req.category.id}).save(category).then(function(model) {
		res.jsonp(model);
	}).error(function(err) {
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * Delete an Category
 */
exports.delete = function(req, res) {
	var category = req.category.attributes;

	new categoryModel({id:category.id}).then(function(model) {
		model.destroy().then(function() {
			res.jsonp(category);
		});
	}).otherwise(function(err) {
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * List of Categories
 */
exports.list = function(req, res) { 
	new categoryModel({status:1}).fetchAll().then(function(categories){ 
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
	new categoryModel({id:id}).fetch().then(function(cat) { 
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
