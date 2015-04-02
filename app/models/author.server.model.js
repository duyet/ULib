'use strict';

var Model = require('../../config/model');
var checkit  = require('checkit');
var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));

var rules = {
	name: 'required',
	description: '',
	status: 'numeric',
};

var Authors = Model.extend({
	tableName: 'Authors',
	
	initialize: function() {
		this.on('saving', this.validateSave);
	},

	validateSave: function() {
		return checkit(rules).run(this.attributes);
	},

})

module.exports = Authors;