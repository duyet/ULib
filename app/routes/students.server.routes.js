'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var students = require('../../app/controllers/students.server.controller');

	// Students Routes
	app.route('/students')
		.get(students.list)
		.post(users.requiresLogin, students.create);

	app.route('/students/:studentId')
		.get(students.read)
		.put(users.requiresLogin, students.hasAuthorization, students.update)
		.delete(users.requiresLogin, students.hasAuthorization, students.delete);

	// Finish by binding the Student middleware
	app.param('studentId', students.studentByID);
};
