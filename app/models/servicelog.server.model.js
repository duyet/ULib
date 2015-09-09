'use strict';

var Model = require('../../config/model');
var checkit  = require('checkit');
var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));

//var Services = require('./service.server.model');

var Service = require('./service.server.model');
var Staff = require('./staff.server.model');

var ServiceLog = Model.extend({
	tableName: 'ServiceLogs',
	idAttribute: 'servicelog_id',
	
	service: function () {
		return this.belongsTo(Service, 'service_id');
	},

	staff: function() {
		return this.belongsTo(Staff, 'staff_id');
	},
	
	initialize: function() {
		this.on('saving', this.validateSave);
	},

	validateSave: function() {
		return checkit({
			
		}).run(this.attributes);
	},

})

module.exports = ServiceLog;