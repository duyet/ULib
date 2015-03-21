'use strict';

var passport = require('passport');

var staff = require('../models/staff.server.model');

/**
 * Create a article
 */
exports.index = function(req, res) {
	res.json(staff.fetchAll());
};

exports.signin = function(req, res, next) {
	passport.authenticate('local-login', function(err, user, info) {
		if (err) { return res.status(400).send(err); }
		
		if (!user) {
			console.log('Log in signin: ');
			console.log(req.flash());
			return res.status(400).send(err);
		}
		
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			return res.json(req.user);
		});
	})(req, res, next);



	/*
	passport.authenticate('local-login', {
			successRedirect : '#!/home',
			failureRedirect : '#!/signin11111'
			//failureFlash: function() { console.log('Log failt') }
		}, function(req, res) {
			console.log(res);

			if (req.body.remember) {
				req.session.cookie.maxAge = 1000 * 60 * 3;
			} else {
				req.session.cookie.expires = false;
			}
			res.json(req.user); // Login success
	});

	*/
};
