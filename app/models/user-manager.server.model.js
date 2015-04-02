'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * User manager Schema
 */
var UserManagerSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill User manager name',
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

mongoose.model('UserManager', UserManagerSchema);