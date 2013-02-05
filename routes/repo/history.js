
	var app = require('babel');
	var Githubuser = app.require('githubuser');
	var Repo = app.require('repo');


	app.get('/repo/:owner/:repo', function (req, res, next) {
		var user = req.session.user, viewData = req.params.repo;

		viewData.partials = { tab: 'history' };
		viewData.isActiveTab = function (tab) {
			if (this.partials.tab === tab) return 'active';
			return '';
		};

		user.getConfigRepo(req.params.repoName, function (err, repo) {
			if (err) return res.redirect('/error?e=');
			if (repo) {
				
				viewData.events = [];
				for(var i in repo.data.events) {
					if (repo.data.events.hasOwnProperty(i)) {
						viewData.events.push(repo.data.events[i])
					}
				}

				viewData.eventList = repo.data.eventList;
			}

			res.render('repo.html', viewData);
		});

	});