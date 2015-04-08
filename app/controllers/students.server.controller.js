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
 * Import 
 */
exports.importStudents = function(req, res) {
	var headerLine = [ 'ID', 'Name', 'Subject', 'Email' ];

	var data = _.pick(req.body, 'type'), 
    file = req.files.file;

	console.log(data); //original name (ie: sunset.png)
	console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)

	var dataImport = false;
	var numOfLineImported = 0;

	if (path.extname(file.path) == '.json') {

	}

	// Xls file 
	if (path.extname(file.path) == '.xls' || path.extname(file.path) == '.xlsx') {
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
						new studentModel({
							student_id: result[row].id, 
							name: result[row].name.trim(), 
							subject: result[row].subject.trim(), 
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
