'use strict';

/**
 * Module dependencies.
 */
// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

var mysql = require('mysql'),
	path = require('path'),
	bcrypt = require('bcrypt-nodejs'),
	config = require('./config');

var connection = mysql.createConnection(config.db);
connection.query('USE ' + config.db.database);

/**
 * Module init function.
 */
module.exports = function(passport) {
	// Serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		connection.query('SELECT * FROM Staff WHERE id = ? ', [id], function(err, rows){
			done(err, rows[0]);
		});

	});

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
	passport.use(
		'local-signup',
		new LocalStrategy({
			// by default, local strategy uses username and password, we will override with email
			usernameField : 'username',
			passwordField : 'password',
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},

		function(req, username, password, done) {
			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
			connection.query('SELECT * FROM Staff WHERE username = ?', [username], function(err, rows) {
				if (err) {
					return done(err);
				}
				if (rows.length) {
					return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
				} else {
					// if there is no user with that username
					// create the user
					var newUserMysql = {
						username: username,
						password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
					};

					var insertQuery = 'INSERT INTO Staff ( username, password ) values (?,?)';

					connection.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
						newUserMysql.id = rows.insertId;

						return done(null, newUserMysql);
					});
				}
			});
		})
	);

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            console.log('Query to SQL...' + 'SELECT * FROM Staff WHERE username = ' + [username]);
            
            connection.query('SELECT * FROM Staff WHERE username = ?', [username], function(err, rows){
                if (err) {
                	console.log('Error:: ' + err);
                    return done(err);
                }
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );

	// Initialize strategies
	//config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {
	//	require(path.resolve(strategy))();
	//});
};