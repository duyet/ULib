'use strict';

var config = require('./config');
var Promise = require('bluebird');

var knex = require('knex')({
  client: 'mysql',
  connection: config.db
});

var bookshelf = require('bookshelf')(knex);

exports.bookshelf = bookshelf;
module.exports = bookshelf.Model;