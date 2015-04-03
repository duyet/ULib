'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var authors = require('../../app/controllers/authors.server.controller');

	// Authors Routes
	app.route('/authors')
		.get(authors.list)
		.post(users.requiresLogin, authors.create);

	app.route('/authors/:authorId')
		.get(authors.read)
		.put(users.requiresLogin, authors.hasAuthorization, authors.update)
		.delete(users.requiresLogin, authors.hasAuthorization, authors.delete);

	// Finish by binding the Author middleware
	app.param('authorId', authors.authorByID);
};
