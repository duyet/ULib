'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var languages = require('../../app/controllers/languages.server.controller');

	// Languages Routes
	app.route('/languages')
		.get(languages.list)
		.post(users.requiresLogin, languages.create);

	app.route('/languages/:languageId')
		.get(languages.read)
		.put(users.requiresLogin, languages.hasAuthorization, languages.update)
		.delete(users.requiresLogin, languages.hasAuthorization, languages.delete);

	// Finish by binding the Language middleware
	app.param('languageId', languages.languageByID);
};
