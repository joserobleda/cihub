
	var app = require('babel');
	var Githubuser = app.require('githubuser');


	app.param('repo', function(req, res, next, id) {
		var user = req.session.user;

		if (req.params.owner) {
			user.api('/repos/'+req.params.owner+'/'+ id, function (err, repoData) {
				if (err) return next();

				req.params.repo = repoData;
				next();
			});
		} else {
			next();
		}
	});

	app.get('/repo/:owner/:repo/:option?', function (req, res, next) {
		var user = req.session.user, 
			option = req.params.option || 'history',
			repo = req.params.owner + '/' + req.params.repo.name,
			viewData = req.params.repo;

		viewData.partials = { tab: option };
		viewData.isActiveTab = function (tab) {
			if (this.partials.tab === tab) return 'active';
		};

		res.render('repo.html', viewData);
	});