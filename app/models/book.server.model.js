'use strict';

var Model = require('../../config/model');
var checkit  = require('checkit');
var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));

var Category = require('./category.server.model');
var Publisher = require('./publisher.server.model');
var Language = require('./language.server.model');

var Book = Model.extend({
	tableName: 'Books',
	
	category: function () {
		return this.belongsTo(Category, 'category_id');
	},

	publisher: function() {
		return this.belongsTo(Publisher, 'publisher_id');
	},

	language: function() {
		return this.belongsTo(Language, 'language_id');
	},
	
	initialize: function() {
		this.on('saving', this.validateSave);
	},

	validateSave: function() {
		return checkit({
			name: 'required',
			number: 'number',
			available_number: 'number'
		}).run(this.attributes).then(function(validated) {
  			console.log(validated);
		}).catch(checkit.Error, function(err) {
			console.log(err.toJSON());
		});
	},

})

module.exports = Book;