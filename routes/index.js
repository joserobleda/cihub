
	var app = require('babel');


	app.get('/', function (req, res, next) {
		var user = req.session.user;

		user.getAllRepos(function (err, repos) {
			if (err) return res.status(500).end(err.toString());

			res.render('repos.html', { repos: repos });
		});
	});