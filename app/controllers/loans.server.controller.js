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

var bookshelf = require('bookshelf');

var errorHandler = require('./errors.server.controller');
var config = require('../../config/config');
var loanModel = require('../models/loan.server.model');
var studentModel = require('../models/student.server.model');

/**
 * Create a Loan
 */
exports.create = function(req, res) {
	//req.assert('name', 'Language name is empty.').notEmpty();

	var err = req.validationErrors();
	if (err) {
		return res.status(400).send({message: err});
	}

	var studentId = req.body.student_id || 0;
	studentId = parseInt(studentId);
	if (studentId <= 0) {
		return res.status(400).send('Please enter student ID');
	}

	var bookIds = req.body.book_ids || [];

	bookshelf.transaction(function(t) {
		// Check student ID
		return new studentModel({student_id: studentId}).fetch().catch(function(err) {
			return res.status(400).send({message: 'Student not found!'});
		});

	}).then(function(student) {

	});
};

/**
 * Show the current Loan
 */
exports.read = function(req, res) {
	res.jsonp(req.loan);
};

/**
 * Update a Loan
 */
exports.update = function(req, res) {
	var loan = req.loan ;

	loan = _.extend(loan , req.body);

	loan.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(loan);
		}
	});
};

/**
 * Delete an Loan
 */
exports.delete = function(req, res) {
	var loan = req.loan ;

	loan.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(loan);
		}
	});
};

/**
 * List of Loans
 */
exports.list = function(req, res) { 
	Loan.find().sort('-created').populate('user', 'displayName').exec(function(err, loans) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(loans);
		}
	});
};

/**
 * Loan middleware
 */
exports.loanByID = function(req, res, next, id) { 
	Loan.findById(id).populate('user', 'displayName').exec(function(err, loan) {
		if (err) return next(err);
		if (! loan) return next(new Error('Failed to load Loan ' + id));
		req.loan = loan ;
		next();
	});
};

/**
 * Loan authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.loan.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
