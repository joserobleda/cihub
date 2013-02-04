
	var app = require('babel');
	var Githubuser = app.require('githubuser');


	app.param('user', function(req, res, next, id) {
		Githubuser.findById(id, function (err, user) {
			if (err) return next(err);
			req.params.user = req.user = user;
			next();
		});
	});

	app.param('repo', function(req, res, next, id) {
		var user = req.user;

		if (req.params.owner) {
			user.api('/repos/'+req.params.owner+'/'+ id, function (err, repoData) {
				if (err) return next();

				req.params.repoName = req.params.owner + '/' + req.params.repo;
				req.params.repo = repoData;
				next();
			});
		} else {
			next();
		}
	});


