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
var CategoryModel = require('../models/category.server.model');

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

	new CategoryModel({name:categoryName.trim(), description:description.trim(), loan_time:loanTime}).save().then(function(model) { 
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
	var headerLine = [ 'Status', 'Name', 'Description', 'Loan' ];

	var data = _.pick(req.body, 'type'), 
    file = req.files.file;

	console.log(data); //original name (ie: sunset.png)
	console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)

	var dataImport = false;
	var numOfLineImported = 0;

	// Xls file 
	if (path.extname(file.path) == '.xls' || path.extname(file.path) == '.xlsx' || path.extname(file.path) == '.csv') {
		var node_xj = require('xls-to-json');
		node_xj({
			input: file.path,
			output: null,
		}, function(err, result) {
			if(err) console.error('Parse error: ', err);
			
			if (!result || result.constructor !== Array) {
				return res.status(400).send({message: 'Could not parse xls file.'});
			}

			console.log('The import data is: ', result);

			for (var row in result) {
				if (result[row] !== null && typeof result[row] === 'object') {
					console.log('The current data of row ' + row + ' is: ', result[row]);

					var keys = Object.keys(result[row]);

					if (1 || keys.equals(headerLine)) { // TODO: check all key of current row include all the headerLine
						new CategoryModel({
							name: result[row].Name || '', 
							description: result[row].Description || '', 
							loan_time: parseInt(result[row].Loan || 0),
							status: parseInt(result[row].Status || 0)
						}).save().then(function(model) { 
							numOfLineImported += 1;

						}).error(function(err) { 
							// Skip error 
							console.log(err);
						});
					}

					console.log('Imported ' + numOfLineImported);

				}
			}

			return res.status(200).send('Imported success.');

		});
	}
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
	var id = req.category.id;
	var category = req.category.attributes;

	category.description = req.body.description;
	category.loan_time = req.body.loan_time;
	category.name = req.body.name;

	console.log('Update category with data:', id, category);

	new CategoryModel({category_id:id}).save(category).then(function(model) {
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
	console.log(category);

	new CategoryModel({category_id:category.category_id}).then(function(model) {
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
	new CategoryModel({status:1}).fetchAll().then(function(categories){ 
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
	new CategoryModel({category_id:id}).fetch().then(function(cat) { 
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


// =================================
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    //if (this.length != array.length)
    //    return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
} 