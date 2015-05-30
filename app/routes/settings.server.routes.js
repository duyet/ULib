'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var settings = require('../../app/controllers/settings.server.controller');

	// Settings Routes
	app.route('/settings')
		.get(settings.list)
		.post(users.requiresLogin, settings.create);

	app.route('/settings/librules')
		.get(settings.listLibRules);

	app.route('/settings/:settingId')
		.get(settings.read)
		.put(users.requiresLogin, settings.hasAuthorization, settings.update)
		.delete(users.requiresLogin, settings.hasAuthorization, settings.delete);

	// Finish by binding the Setting middleware
	app.param('settingId', settings.settingByID);
};
