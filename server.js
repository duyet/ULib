'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mysql = require('mysql'),
	chalk = require('chalk');

/**	
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mysql.createConnection(config.db).connect(function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MySQL Server!'));
		console.log(chalk.red(err));
	}
});

// Init the express application
var app = require('./config/express')(db);

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);