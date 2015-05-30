'use strict';

var Model = require('../../config/model');
var config = require('../../config/config');
var connection = config.connection;

connection.connect();

var librules = [];

var initDataFromDb = function() {
	return connection.query("SELECT * FROM LibRules", function(err, rows, fields) {
	  if (err) throw err;
	 
	  if (rows.length) librules = rows;
	  return librules;
	});	
}
initDataFromDb();

module.exports.data = function() {
	return librules || initDataFromDb();
};

module.exports.get = function(key, default_value) {
	if (librules.length) {
		for (var i in librules) {
			if (librules[i].name === key) return librules[i].value;
		}
	}

	if (default_value) return default_value;
	return false;
};
