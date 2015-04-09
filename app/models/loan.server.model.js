'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Loan Schema
 */
var LoanSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Loan name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Loan', LoanSchema);