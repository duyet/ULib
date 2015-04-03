'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var publishers = require('../../app/controllers/publishers.server.controller');

	// Publishers Routes
	app.route('/publishers')
		.get(publishers.list)
		.post(users.requiresLogin, publishers.create);

	app.route('/publishers/:publisherId')
		.get(publishers.read)
		.put(users.requiresLogin, publishers.hasAuthorization, publishers.update)
		.delete(users.requiresLogin, publishers.hasAuthorization, publishers.delete);

	// Finish by binding the Publisher middleware
	app.param('publisherId', publishers.publisherByID);
};
