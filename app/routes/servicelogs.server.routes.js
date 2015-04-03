'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var servicelogs = require('../../app/controllers/servicelogs.server.controller');

	// Servicelogs Routes
	app.route('/servicelogs')
		.get(servicelogs.list)
		.post(users.requiresLogin, servicelogs.create);

	app.route('/servicelogs/:servicelogId')
		.get(servicelogs.read)
		.put(users.requiresLogin, servicelogs.hasAuthorization, servicelogs.update)
		.delete(users.requiresLogin, servicelogs.hasAuthorization, servicelogs.delete);

	// Finish by binding the Servicelog middleware
	app.param('servicelogId', servicelogs.servicelogByID);
};
