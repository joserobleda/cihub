
	var app = require('babel');
	var Githubuser = app.require('githubuser');
	var Repo = app.require('repo');

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

		if (option === 'config') {
			user.getConfigRepo(repo, function (err, repo) {
				if (err) return res.redirect('/error?e=');

				if (repo) viewData.actions = repo.getActions();

				res.render('repo.html', viewData);
			});
		} else {
			res.render('repo.html', viewData);
		}
	});


	app.post('/repo/:owner/:repo/config', function (req, res, next) {
		var user = req.session.user, repo = req.params.owner + '/' + req.params.repo.name;

		var search = {
			user: user.getId(),
			repo: repo
		};

		Repo.findOne(search, function (err, repo) {
			var actions = [];

			repo.setActions(req.body.actions, function (err) {
				res.redirect('back');
			});
			
		});
	});


	app.put('/repo/:owner/:repo/config', function (req, res, next) {
		var user = req.session.user, repo = req.params.owner + '/' + req.params.repo.name;

		var data = {
			user: user.getId(),
			repo: repo
		};

		var search = {
			user: data.user,
			repo: repo
		};

		Repo.findOrCreate(search, data, function (err, repo) {
			if (err) return res.redirect('/error?e=repo_save');

			if (!repo.data.hook) {
			//	repo.createHook(user);
			};

			res.redirect(req.originalUrl);
		});
	});