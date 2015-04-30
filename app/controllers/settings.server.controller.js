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
var SettingModel = require('../models/setting.server.model');

/**
 * Create a Setting
 */
exports.create = function(req, res) {
	req.assert('name', 'Setting name is empty.').notEmpty();

	var err = req.validationErrors();
	if (err) {
		return res.status(400).send({message: err});
	}

	var settingName = req.body.name || '';
	var description = req.body.description || '';

	new SettingModel({name:settingName.trim(), description:description.trim()}).save().then(function(model) { 
		res.jsonp(model);
	}).error(function(err) { 
		console.log(err);
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};


/**
 * Show the current Setting
 */
exports.read = function(req, res) {
	res.jsonp(req.setting);
};

/**
 * Update a Setting
 */
exports.update = function(req, res) {
	var setting = req.setting.attributes;

	setting.description = req.body.description;
	setting.name = req.body.name;

	console.log('Update setting with data:', setting);

	new SettingModel({id:req.setting.id}).save(setting).then(function(model) {
		res.jsonp(model);
	}).error(function(err) {
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * Delete an Setting
 */
exports.delete = function(req, res) {
	console.log(req.setting);

	new SettingModel({id:req.setting.id}).fetch().then(function(model) {
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
 * List of Setting
 */
exports.list = function(req, res) { 
	new SettingModel({status:1}).fetchAll().then(function(setting){ 
		res.jsonp(setting);
	}).error(function(err) { 
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * Setting middleware
 */
exports.settingByID = function(req, res, next, id) { 
	new SettingModel({id:id}).fetch().then(function(setting) { 
		if (! setting) return next(new Error('Failed to load setting ' + id));

		req.setting = setting;
		next();
	}).error(function(err) {
		console.log('Not found setting!');
		return next(err);
	});
};

/**
 * Setting authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
