
	var app = require('babel');


	app.get('/', function (req, res, next) {
		var user = req.session.user;

		user.getAllRepos(function (err, repos) {
			if (err) return res.redirect('/error?e=');

			res.render('repos.html', { repos: repos });
		});

		
	});