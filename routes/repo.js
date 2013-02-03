
	var app = require('babel');
	var Githubuser = app.require('githubuser');
	var Repo = app.require('repo');


	app.get('/repo/:owner/:repo/config', function (req, res, next) {
		var user = req.session.user, viewData = req.params.repo;

		viewData.partials = { tab: 'config' };
		viewData.isActiveTab = function (tab) {
			if (this.partials.tab === tab) return 'active';
		};

		
		user.getConfigRepo(req.params.repoName, function (err, repo) {
			if (err) return res.redirect('/error?e=');

			if (repo) viewData.actions = repo.getActions();

			res.render('repo.html', viewData);
		});
	});


	app.get('/repo/:owner/:repo', function (req, res, next) {
		var user = req.session.user, viewData = req.params.repo;

		viewData.partials = { tab: 'history' };
		viewData.isActiveTab = function (tab) {
			if (this.partials.tab === tab) return 'active';
		};

		res.render('repo.html', viewData);
	});



	app.post('/repo/:owner/:repo/config', function (req, res, next) {
		var user = req.session.user, repo = req.params.owner + '/' + req.params.repo.name;

		var search = {
			user: user.getId(),
			repo: repo
		};

		Repo.findOne(search, function (err, repo) {
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
				repo.createHook(user);
			};

			res.redirect(req.originalUrl);
		});
	});