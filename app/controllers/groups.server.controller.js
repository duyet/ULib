'use strict';

/**
 * Module dependencies.
 */
var errorHandler = require('./errors.server.controller');
var config = require('../../config/config');
var group = require('../models/group.server.model');
var async = require('async')
/**
 * Create a Group
 */
exports.create = function(req, res) {
	req.assert('name', 'Group name is empty.').notEmpty();
	var err = req.validationErrors();
	if (err) {
		return res.status(400).send({message: err});
	}

	var name = req.body.name || '';
	var description = req.body.description || '';

	new group({name: name, description:description}).save().then(function(model) {
		res.jsonp(model);
	}).error(function(err) {
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * Show the current Group
 */
exports.read = function(req, res) {
	res.jsonp(req.group);
};

/**
 * Update a Group
 */
exports.update = function(req, res) {
	var group = req.group ;

	group = _.extend(group , req.body);

	group.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(group);
		}
	});
};

/**
 * Delete an Group
 */
exports.delete = function(req, res) {
	var group = req.group ;

	group.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(group);
		}
	});
};

/**
 * List of Groups
 */
exports.list = function(req, res) { 
	new group().fetchAll().then(function(groups){ 
		res.jsonp(groups);
	}).error(function(err) { 
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});

};

/**
 * Group middleware
 */
exports.groupByID = function(req, res, next, id) {
	return new group({id:id}).fetch().then(function(group) { 
		if (! group) return next(new Error('Failed to load group ' + id));
		req.group = group;
		next();
	}).error(function(err) { 
		return next(err);
	});
};

/**
 * Group authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.group.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
