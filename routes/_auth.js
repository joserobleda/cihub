
	var app = require('babel');
	var social = require('babel/lib/social');
	var Githubuser = app.require('githubuser');


	social.github.login('/auth/github', function(err, req, res){
		if (err) return console.log(err);

		Githubuser.findOrCreate({id:req.body.id}, req.body, function (err, user) {
			if (err) return res.status(500).end(err.toString());

			user.set(body).save(function (err) {
				if (err) return res.status(500).end(err.toString());

				req.session.userID = user.getId();
				res.redirect('/');	
			});
			
		});
	});


	app.all('*', function (req, res, next) {
		if (req.session.userID) {
			Githubuser.findById(req.session.userID, function (err, user){
				if (err) return res.redirect('/error?e=github_login');

				req.user = req.session.user = user;
				next();
			});
		} else {
			var pieces = req.originalUrl.split('/');
			if (pieces[pieces.length-1] === 'hook') {
				return next();	
			}
			
			res.redirect('/auth/github');
		}
	});