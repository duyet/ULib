'use strict';

/**
 * Module dependencies.
 */
// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

var mysql = require('mysql'),
	path = require('path'),
	config = require('./config');

var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));
var staff = require('../app/models/staff.server.model');

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
			

				new staff({username: username}).fetch().then(function(user) {
					console.log(user);
					if (user) {
						// This username aldready exists.
						//return res.status(400).send({message: 'User aldready exists!'});
						return done(null, false, req.flash('message','User Already Exists'));
					} else {
						// Register new user
						
						// TODO: missing name on db, fix later
						
						bcrypt.genSalt(10, function(err, salt) {
							bcrypt.hash(password, salt, function(err, hash) {
								 new staff({username: username.toLowerCase().trim(), email: req.param('email'), password:hash}).save({}, {isNew:true})
								.catch(function(e) {
									console.error('Error when save!');
									//res.status(400).send({message: 'Error when save, please try again later!'});
									
									return done(null, false, req.flash('message','Error when save, please try again later!'));
								})
								.then(function(new_staff) {
									console.log('Add new staff success!', new_staff.attributes);

									// Login
									req.login(new_staff.attributes, function(err) {
										if (err) {
											//res.status(400).send(err);
											return done(null, false, err); 
										} else {
											//res.json(new_staff.attributes);
											console.log('Login success!');
											return done(null, new_staff.attributes);
										}
									});


								});	
							});
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
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
        		if (!username || username.length < 5) {
        			return done(null, false, req.flash('loginMessage', 'Username must be at least 5 characters')); 
        		}

        		if (!password || password.length < 5) {
        			return done(null, false, req.flash('loginMessage', 'Password must be at least 5 characters')); 
        		}

        		new staff({username: username.toLowerCase().trim()}).fetch({require: true}).then(function(staff) {
					console.log(staff);

					bcrypt.compare(staff.get('password'), password, function(err, res) {
						if (res === false) {
							return done(null, false, req.flash('loginMessage', 'Password was wrong.')); 
						} else {
							console.log('Login success');
							return done(null, staff.attributes);
						}
					});
				}).catch(function(e) {
					console.log(e);
					return done(null, false, req.flash('loginMessage', 'Username is not found')); 
				});

        		/*
				staff.login(username, password).then(function(staff_user) {
					// Login success
					//res.json(staff_user.omit('password'));
					if (staff_user) {
						req.login(staff_user, function(err) {
							if (err) {
								//res.status(400).send({message:err});
								return done(null, false, req.flash('loginMessage', err)); 
							} else {
								return done(null, staff_user.attributes);
							}
						});	
					}
			  	}).catch(staff.NotFoundError, function() {
					return done(null, false, req.flash('loginMessage', req.body.username + ' is not found')); 
				}).catch(function(err) {
					return done(null, false, req.flash('loginMessage', 'Username or Password was wrong!')); 
				});
				*/

				/*
	            connection.query('SELECT * FROM Staff WHERE username = ?', [username], function(err, rows){
	                if (err) {
	                	console.log('Error:: ' + err);
	                    return done(err);
	                }
	                if (!rows.length) {
	                    return done(null, false, req.flash('loginMessage', 'Can not found user ' + username)); 
	                    // req.flash is the way to set flashdata using connect-flash
	                }

	                // if the user is found but the password is wrong
	                if (!bcrypt.compareSync(password, rows[0].password))
	                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 
	                    // create the loginMessage and save it to session as flashdata

	                // all is well, return successful user
	                return done(null, rows[0]);
	            });
				*/



        })
    );

	// Initialize strategies
	//config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {
	//	require(path.resolve(strategy))();
	//});
};