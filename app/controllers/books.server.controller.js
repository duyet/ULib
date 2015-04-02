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
var book = require('../models/book.server.model');
/**
 * Create a Book
 */
exports.create = function(req, res) {
	var book = new Book(req.body);
	book.user = req.user;

	book.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(book);
		}
	});
};

/**
 * Show the current Book
 */
exports.read = function(req, res) {
	res.jsonp(req.book);
};

/**
 * Update a Book
 */
exports.update = function(req, res) {
	var book = req.book ;

	book = _.extend(book , req.body);

	book.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(book);
		}
	});
};

/**
 * Delete an Book
 */
exports.delete = function(req, res) {
	var book = req.book ;

	book.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(book);
		}
	});
};

/**
 * List of Books
 */
exports.list = function(req, res) { 
	Book.find().sort('-created').populate('user', 'displayName').exec(function(err, books) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(books);
		}
	});
};

/**
 * Book middleware
 */
exports.bookByID = function(req, res, next, id) { 
	Book.findById(id).populate('user', 'displayName').exec(function(err, book) {
		if (err) return next(err);
		if (! book) return next(new Error('Failed to load Book ' + id));
		req.book = book ;
		next();
	});
};

/**
 * Book authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.book.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
