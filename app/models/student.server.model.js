'use strict';

var Model = require('../../config/model');
var checkit  = require('checkit');
var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));

var rules = {
	student_id: [ 'required'],
	name: 'required',
	subject: 'maxLength:45',
	sex: [],
	email: []
};

var Students = Model.extend({
	tableName: 'Students',
	
	initialize: function() {
		this.on('saving', this.validateSave);
	},

	validateSave: function() {
		return checkit(rules).run(this.attributes);
	},

})

module.exports = Students;