'use strict';

var Model = require('../../config/model');
var checkit  = require('checkit');
var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));

var rules = {
	username: 'required',
	email: ['required', 'email'],
	password: 'required'
};

var Staff = Model.extend({
	tableName: 'Staffs',
	idAttribute: 'staff_id',
	
	initialize: function() {
		this.on('saving', this.validateSave);
	},

	validateSave: function() {
		return checkit(rules).run(this.attributes);
	},

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
	}),

	findById: Promise.method(function(id) {	
		return this({id:id}).fetch();
	})
});

module.exports = Staff;