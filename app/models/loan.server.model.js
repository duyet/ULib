'use strict';

var Model = require('../../config/model');
var checkit  = require('checkit');
var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));

var Loandetail = require('./loandetail.server.model');

var rules = {
	//name: 'required',
	//description: 'maxLength:250'
};

var Loan = Model.extend({
	tableName: 'Loans',
	idAttribute: 'loan_id',
	
	student: function() {
		return this.belongTo(Author);
	},

	staff: function() {
		return this.belongTo(Loandetail);
	},

	initialize: function() {
		//Model.apply(this, arguments);
		//this.on('saving', this.validateSave);
	},

	validateSave: function() {
		return checkit(rules).run(this.attributes);
	},

})

module.exports = Loan;