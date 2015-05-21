'use strict';

var Model = require('../../config/model');
var checkit  = require('checkit');
var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));

var Loan = require('./loan.server.model');
var Book = require('./book.server.model');

var Loandetail = Model.extend({
	tableName: 'Loandetails',
	idAttribute: 'loandetail_id',

	loan: function() {
		return this.belongsTo(Loan);
	},

	book: function() {
		return this.belongsTo(Book);
	},
	
	initialize: function() {
		//Model.apply(this, arguments);
		//this.on('saving', this.validateSave);
	},

	validateSave: function() {
		return checkit(rules).run(this.attributes);
	},

})

module.exports = Loandetail;