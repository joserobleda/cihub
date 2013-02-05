
	var app = require('babel');
	var Githubuser = app.require('githubuser');
	var Repo = app.require('repo');


	app.get('/repo/:owner/:repo/:sha', function (req, res, next) {
		var user = req.session.user, viewData = req.params.repo;

		viewData.sha = req.params.sha;
		viewData.partials = { tab: 'sha' };

		viewData.isActiveTab = function (tab) {
			if ('history' === tab) return 'active';
			return '';
		};

		user.getConfigRepo(req.params.repoName, function (err, repo) {
			var events = repo.data.events;

			if (events[req.params.sha]) {
				viewData.event = events[req.params.sha];

				res.render('repo.html', viewData);
			};
		});
		
	});
