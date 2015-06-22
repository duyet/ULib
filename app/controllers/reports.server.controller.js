'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));
var async = require('async');

var errorHandler = require('./errors.server.controller');
var config = require('../../config/config');
//var PublisherModel = require('../models/publisher.server.model');
var connection = config.connection;

exports.all = function(req, res) {
	res.json([]);
};

exports.categories = function(req, res) {
	if (req.query && req.query.month) var month = req.query.month;

	if (month) {
		connection.query('CALL `ReportCategoriesMonth`(?);', [month], function(err, result) {
		    if (err) {
		        connection.rollback(function() {
		            throw err;

		            return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
		        });
		    }

		    res.jsonp(result[0] || []);
		});
	} else {
		connection.query('CALL `ReportCategories`();', [], function(err, result) {
		    if (err) {
		        connection.rollback(function() {
		            throw err;

		            return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
		        });
		    }

		    res.jsonp(result[0] || []);
		});	
	}
};

exports.books = function(req, res) {
	connection.query('CALL `ReportBooks`();', [], function(err, result) {
	    if (err) {
	        connection.rollback(function() {
	            throw err;

	            return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
	        });
	    }

	    res.jsonp(result[0] || []);
	});
};

exports.loanOutOfDate = function(req, res) {
	connection.query('CALL ReportBookOutOfDate()', [], function(err, result) {
	    if (err) {
	        connection.rollback(function() {
	            throw err;

	            return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
	        });
	    }

	    res.jsonp(result[0] || []);
	});
};

exports.publishers = function(req, res) {
	connection.query('CALL ReportPublishers()', [], function(err, result) {
	    if (err) {
	        connection.rollback(function() {
	            throw err;

	            return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
	        });
	    }

	    res.jsonp(result[0] || []);
	});
};

exports.authors = function(req, res) {
	connection.query('CALL ReportAuthors()', [], function(err, result) {
	    if (err) {
	        connection.rollback(function() {
	            throw err;

	            return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
	        });
	    }

	    res.jsonp(result[0] || []);
	});
};

exports.loanDataChart = function(req, res) {

}

exports.loans = function(req, res) {
	if (req.query && req.query.month) var month = req.query.month;
	if (req.query && req.query.start_date && req.query.end_date) {
		var is_in_range = true;
		var start_date = req.query.start_date;
		var end_date = req.query.end_date;
	}

	if (is_in_range) {
		connection.query('CALL ReportLoansRange(?, ?)', [start_date, end_date], function(err, result) {
		    if (err) {
		        connection.rollback(function() {
		            throw err;

		            return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
		        });
		    }

		    res.jsonp(result[0] || []);
		});
	}
	else if (month) {
		connection.query('CALL ReportLoansMonth(?)', [month], function(err, result) {
		    if (err) {
		        connection.rollback(function() {
		            throw err;

		            return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
		        });
		    }

		    res.jsonp(result[0] || []);
		});
	} else {
		connection.query('CALL ReportLoans()', [], function(err, result) {
		    if (err) {
		        connection.rollback(function() {
		            throw err;

		            return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
		        });
		    }

		    res.jsonp(result[0] || []);
		});
	}
};

exports.income = function(req, res) {
	if (req.query && req.query.start_date && req.query.end_date) {
		var is_in_range = true;
		var start_date = req.query.start_date;
		var end_date = req.query.end_date;
	}

	var q = "SELECT * FROM ServiceLogs, Services WHERE ServiceLogs.service_id = Services.id";
	if (is_in_range) {
		q += " AND ServiceLogs.created BETWEEN " + connection.escape(start_date) + " AND " + connection.escape(end_date);
	}
	console.info(q);
	connection.query(q, [], function(err, result) {
		if (err) {
	        connection.rollback(function() {
	            throw err;

	            return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
	        });
	    }

	    console.error(result);
	    res.jsonp(result || []);
	});
}

/**
 * Report middleware
 */
exports.reportByID = function(req, res, next, id) { 
	Report.findById(id).populate('user', 'displayName').exec(function(err, report) {
		if (err) return next(err);
		if (! report) return next(new Error('Failed to load Report ' + id));
		req.report = report ;
		next();
	});
};

/**
 * Report authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.report.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
