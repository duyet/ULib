'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');
var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));
var crypto	= require('crypto');
var async = require('async');
var path = require('path');

var errorHandler = require('./errors.server.controller');
var config = require('../../config/config');
var LibRuleModel = require('../models/librules.server.model');

module.exports = function() {
	
}

exports.list = function(req, res) {
	res.jsonp(LibRuleModel.data);
}