'use strict';

var p = require('../controllers/page.server.controller');

module.exports = function(app) {
	// Article Routes
	app.get('/about', p.about);
};