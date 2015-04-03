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
var studentModel = require('../models/student.server.model');

/**
 * Create a Student
 */
exports.create = function(req, res) {
	req.assert('student_id', 'Student ID is Invalid.').isInt().notEmpty();
	req.assert('name', 'Student name is empty.').notEmpty();
	
	var err = req.validationErrors();
	if (err) {
		return res.status(400).send({message: err});
	}

	var studentId = req.body.student_id || 0;
	var studentName = req.body.name || '';
	var subject = req.body.subject || '';
	var sex = req.body.sex || -1;
	var email = req.body.email || '';

	new studentModel({
		student_id: studentId, 
		name: studentName.trim(), 
		subject: subject.trim(),
		sex: sex,
		email: email
	}).save().then(function(model) { 
		res.jsonp(model);
	}).error(function(err) { 
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	})
};


/**
 * Show the current Student
 */
exports.read = function(req, res) {
	res.jsonp(req.student);
};

/**
 * Update a Student
 */
exports.update = function(req, res) {
	var student = req.student.attributes;
	
	var studentId = req.body.student_id || 0;
	var studentName = req.body.name || '';
	var subject = req.body.subject || '';
	var sex = req.body.sex || -1;
	var email = req.body.email || '';

	console.log('Update student with data:', student);

	new studentModel({id:req.student.student_id}).save(student).then(function(model) {
		res.jsonp(model);
	}).error(function(err) {
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * Delete an Student
 */
exports.delete = function(req, res) {
	var student = req.student.attributes;

	new studentModel({id:student.student_id}).then(function(model) {
		model.destroy().then(function() {
			res.jsonp(student);
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
	new studentModel({status:1}).fetchAll().then(function(students){ 
		res.jsonp(students);
	}).error(function(err) { 
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * Student middleware
 */
exports.studentByID = function(req, res, next, id) { 
	new studentModel({id:id}).fetch().then(function(stdt) { 
		if (! stdt) return next(new Error('Failed to load Student ' + id));

		req.student = stdt;
		next();
	}).error(function(err) {
		console.log('Not found student!');
		return next(err);
	});
};

/**
 * Student authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
