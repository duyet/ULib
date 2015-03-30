'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var userManagers = require('../../app/controllers/user-managers.server.controller');

	// User managers Routes
	app.route('/user-managers')
		.get(userManagers.list)
		.post(users.requiresLogin, userManagers.create);

	app.route('/user-managers/:userManagerId')
		.get(userManagers.read)
		.put(users.requiresLogin, userManagers.hasAuthorization, userManagers.update)
		.delete(users.requiresLogin, userManagers.hasAuthorization, userManagers.delete);

	// Finish by binding the User manager middleware
	app.param('userManagerId', userManagers.userManagerByID);
};
