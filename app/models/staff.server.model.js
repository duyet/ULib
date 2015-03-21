'use strict';

var Model = require('../../config/model');
var checkit  = require('checkit');
var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));

var Staff = Model.extend({
  tableName: 'Staff',
},
{
	login: Promise.method(function(username, password) {
		if (!username || !password) {
			throw new Error('Username and password are both required');
		}
		
		return new this({username: username.toLowerCase().trim()}).fetch({require: true}).tap(function(staf) {
			return bcrypt.compareAsync(staff.get('password'), password);
		});
	}),

	register: Promise.method(function(username, password, email, name) {
		// TODO: missing name on db, fix later
		var _this = this;
		return bcrypt.genSalt(10, function(err, salt) {
			return bcrypt.hash(password, salt, function(err, hash) {
				return new _this({username: username.toLowerCase().trim(), email: email, password:hash}).save({}, {isNew:true})
				.catch(function(e) {
					console.error('Error when save!');
				})
				.then(function(new_staff) {
					console.log('Add new staff success!', new_staff.attributes);

					return true;
					//return new_staff.attributes;
				});	
			});
		});
	})
});

module.exports = Staff;

/*
var Staff = Model.extend({
	
	initialize: function() {
		this.on('saving', this.validateSave);
	},

	validateSave: function() {
		return checkit(rules).run(this.attributes);
	},

	account: function() {
		return this.belongsTo(Account);
	},
}, {
	login: Promise.method(function(email, password) {
		if (!email || !password) throw new Error('Email and password are both required');
			return new this({email: email.toLowerCase().trim()}).fetch({require: true}).tap(function(customer) {
			return bcrypt.compareAsync(customer.get('password'), password);
		});
	})

});
*/