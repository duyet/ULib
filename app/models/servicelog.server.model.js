'use strict';

var Model = require('../../config/model');
var checkit  = require('checkit');
var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));

var rules = {
	name: 'required',
};

var Services = require('../service.server.model');

var ServiceLog = Model.extend({
	tableName: 'ServiceLogs',
	record: function() {
		return this.hasOne(Services);
	},
	
	initialize: function() {
		this.on('saving', this.validateSave);
	},

	validateSave: function() {
		return checkit(rules).run(this.attributes);
	},

})

module.exports = ServiceLog;