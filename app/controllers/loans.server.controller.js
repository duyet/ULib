'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Loan = mongoose.model('Loan'),
	_ = require('lodash');

/**
 * Create a Loan
 */
exports.create = function(req, res) {
	var loan = new Loan(req.body);
	loan.user = req.user;

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
