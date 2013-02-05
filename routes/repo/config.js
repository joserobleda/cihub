
	var app = require('babel');
	var Githubuser = app.require('githubuser');
	var Repo = app.require('repo');


	app.get('/repo/:owner/:repo/config', function (req, res, next) {
		var user = req.session.user, viewData = req.params.repo;

		viewData.partials = { tab: 'config' };
		viewData.isActiveTab = function (tab) {
			if (this.partials.tab === tab) return 'active';
			return '';
		};

		
		user.getConfigRepo(req.params.repoName, function (err, repo) {
			if (err) return res.redirect('/error?e=');

			if (repo) viewData.actions = repo.getActions();

			res.render('repo.html', viewData);
		});
	});




	app.post('/repo/:owner/:repo/config', function (req, res, next) {
		var user = req.session.user, repo = req.params.owner + '/' + req.params.repo.name;

		var search = { repo: repo };

		Repo.findOne(search, function (err, repo) {
			repo.setActions(req.body.actions, function (err) {
				res.redirect('back');
			});	
		});
	});




	app.put('/repo/:owner/:repo/config', function (req, res, next) {
		var user = req.session.user;

		var data = {
			user: user.getId(),
			repo: req.params.repoName
		};

		var search = { repo: req.params.repoName };

		Repo.findOrCreate(search, data, function (err, repo) {
			if (err) return res.redirect('/error?e=repo_save');

			if (!repo.data.hook) {
				repo.createHook(user);
			};

			res.redirect(req.originalUrl);
		});
	});


	app.delete('/repo/:owner/:repo/config', function (req, res, next) {
		var search = { repo: req.params.repoName };

		Repo.findOne(search, function (err, repo) {
			if (err) return res.redirect('/error?e=repo_save');

			repo.removeHook(req.user, function (err) {
				repo.remove(function (err) {
					res.redirect(req.originalUrl);
				});
			});

		});
	});