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
var fs = require('fs');

var errorHandler = require('./errors.server.controller');
var config = require('../../config/config');
var bookModel = require('../models/book.server.model');

/**
 * Create a Service
 */
exports.create = function(req, res) {
	req.assert('book_id', 'ID is invalid.').notEmpty().isInt();
	req.assert('category_id', 'Category is empty.').notEmpty().isInt();
	req.assert('name', 'Name is wrong.').notEmpty();
	req.assert('number', 'Number is wrong.').isInt();
	req.assert('available_number', 'Number is wrong.').isInt();

	var err = req.validationErrors();
	if (err) {
		return res.status(400).send({message: err});
	}

	var id = req.body.book_id || 0;
	var category_id = req.body.category_id || 0;
	var language_id = req.body.language_id || 0;
	var name = req.body.name || '';
	var publisher_id = req.body.publisher_id || 0;
	var number = req.body.number || 0;
	var description = req.body.description || '';
	var available_number = req.body.available_number || number;
	var publish_date = req.body.publish_date || null;
	var image_url = req.body.image || '';
	var status = req.body.status || 1;	

	if (category_id == 0) {
		return res.status(400).send({message: 'Please select service type.'});
	}

	new bookModel({
		id: id,
		category_id: category_id,
		language_id: language_id,
		name: name,
		publisher_id: publisher_id,
		number: number,
		description: description,
		available_number: available_number,
		publish_date: publish_date,
		image: image_url,
		status: status
	}).save({},  {method: "insert"}).then(function(model) { 
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
	res.jsonp(req.book);
};

/**
 * Update a Service
 */
exports.update = function(req, res) {
	var book = req.book.attributes;

	book.description = req.body.description;
	book.name = req.body.name;

	book.id = req.body.id;
	book.category_id = req.body.category_id;
	book.language_id = req.body.language_id;
	book.name = req.body.name;
	book.publisher_id = req.body.publisher_id;
	book.number = req.body.number;
	book.description = req.body.description;
	book.available_number = req.body.available_number;
	book.publish_date = req.body.publish_date;
	book.image = req.body.image;
	book.status = req.body.status;

	console.log('Update book with data:', book);

	new bookModel({id:req.book.id}).save(book).then(function(model) {
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
	console.log(req.book);

	new bookModel({id:req.book.id}).fetch().then(function(model) {
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
	new bookModel({status:1}).fetchAll({withRelated: ['category', 'publisher', 'language']}).then(function(book){ 
		res.jsonp(book);
	}).error(function(err) { 
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * Service middleware
 */
exports.bookByID = function(req, res, next, id) { 
	new bookModel({id:id}).fetch({withRelated: ['category', 'language', 'publisher']}).then(function(book) { 
		if (! book) return next(new Error('Failed to load book ' + id));

		req.book = book;
		next();
	}).error(function(err) {
		console.log('Not found book!');
		return next(err);
	});
};

/**
 * Service authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};


/**
 * Upload image 
 */
exports.upload = function (req, res, next) {
    var data = _.pick(req.body, 'type'), 
    uploadPath = require('path').normalize(config.uploadPath),
    file = req.files.file;

	console.log(file.name); //original name (ie: sunset.png)
	console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)
	console.log(uploadPath); //uploads directory: (ie: /home/user/data/uploads)

	// New file name
	var newFileName = (file.name).replace(/[^A-z0-9\.\-_]+/g, '');
	
	// New Path
	var newPath = path.resolve(uploadPath + '/' + newFileName);

	// Move file from /tmp to /uploads
	var source = fs.createReadStream(file.path);
	var dest = fs.createWriteStream(newPath);
	source.pipe(dest, function() {
		fs.unlinkSync(newPath);
	});
	
	source.on('end', function() {
		return res.send('uploads/' + newFileName);
	});

	source.on('error', function(err) {
		return res.status(400).send({
			message: errorHandler.getErrorMessage('Could not upload')
		});
	});
};
