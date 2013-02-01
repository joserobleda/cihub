
	var app = require('babel');
	var Githubuser = app.require('githubuser');


	// need to allow app.param('repo') access to req.paran.owner
	app.param('owner', function(req, res, next, id) {
		req.param.owner = id;
		next();
	});

	app.param('repo', function(req, res, next, id) {
		var user = req.session.user;

		if (req.param.owner) {
			user.api('/repos/'+req.param.owner+'/'+ id, function (err, repoData) {
				if (err) return next();

				req.param.repo = repoData;
				next();
			});
		} else {
			next();
		}
	});



	app.get('/repo/:owner/:repo', function (req, res, next) {
		var user = req.session.user, repo = req.param.owner + '/' + req.param.repo.name;

		user.getHooks(repo, function (err, hooks) {
			if (err) return next();

			req.param.repo.hooks = hooks;
			console.log(hooks);
			res.render('repo.html', req.param.repo);
		});

		
	});