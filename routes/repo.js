
	var app = require('babel');
	var Githubuser = app.require('githubuser');
	var Repo = app.require('repo');

	app.param('repo', function(req, res, next, id) {
		var user = req.session.user;

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



	app.get('/repo/:owner/:repo/hook', function (req, res) {
		var test = { "after": "c46fde6782d99a02be900495310a743c3ee48c19", "before": "ee250925611c2e688ceab4d19232407878be1816", "commits": [ { "added": [ "static/assets/cihub/fonts/cihub-font.dev.svg", "static/assets/cihub/fonts/cihub-font.eot", "static/assets/cihub/fonts/cihub-font.svg", "static/assets/cihub/fonts/cihub-font.ttf", "static/assets/cihub/fonts/cihub-font.woff", "static/assets/cihub/index.html", "static/assets/cihub/license.txt", "static/assets/cihub/lte-ie7.js", "static/assets/cihub/style.css", "static/assets/js/vendor/foundation/app.js", "static/assets/js/vendor/foundation/foundation.min.js", "static/assets/js/vendor/foundation/jquery.foundation.accordion.js", "static/assets/js/vendor/foundation/jquery.foundation.alerts.js", "static/assets/js/vendor/foundation/jquery.foundation.buttons.js", "static/assets/js/vendor/foundation/jquery.foundation.clearing.js", "static/assets/js/vendor/foundation/jquery.foundation.forms.js", "static/assets/js/vendor/foundation/jquery.foundation.joyride.js", "static/assets/js/vendor/foundation/jquery.foundation.magellan.js", "static/assets/js/vendor/foundation/jquery.foundation.mediaQueryToggle.js", "static/assets/js/vendor/foundation/jquery.foundation.navigation.js", "static/assets/js/vendor/foundation/jquery.foundation.orbit.js", "static/assets/js/vendor/foundation/jquery.foundation.reveal.js", "static/assets/js/vendor/foundation/jquery.foundation.tabs.js", "static/assets/js/vendor/foundation/jquery.foundation.tooltips.js", "static/assets/js/vendor/foundation/jquery.foundation.topbar.js", "static/assets/js/vendor/foundation/jquery.js", "static/assets/js/vendor/foundation/jquery.placeholder.js", "static/assets/js/vendor/foundation/modernizr.foundation.js", "views/config.html", "views/history.html" ], "author": { "email": "joserobleda@gmail.com", "name": "Jose Ignacio Andres", "username": "joserobleda" }, "committer": { "email": "joserobleda@gmail.com", "name": "Jose Ignacio Andres", "username": "joserobleda" }, "distinct": true, "id": "2e188c4d4daa0d846ca741f5fcecf79b4a84a761", "message": "ajustes interfaz", "modified": [ "index.js", "routes/repo.js", "static/assets/css/main.css", "views/index.html", "views/repo.html" ], "removed": [], "timestamp": "2013-02-02T07:30:00-08:00", "url": "https://github.com/Babelbite/cihub/commit/2e188c4d4daa0d846ca741f5fcecf79b4a84a761" }, { "added": [ "models/repo.js", "static/assets/css/chosen.css", "static/assets/img/chosen-sprite.png", "static/assets/img/chosen-sprite@2x.png", "static/assets/js/vendor/chosen.jquery.min.js" ], "author": { "email": "joserobleda@gmail.com", "name": "Jose Ignacio Andres", "username": "joserobleda" }, "committer": { "email": "joserobleda@gmail.com", "name": "Jose Ignacio Andres", "username": "joserobleda" }, "distinct": true, "id": "91b66a30f15db5e3d589b708759428d162f4050b", "message": "Ajustes varios para definir el hook y mostrar las actions por pantalla", "modified": [ "models/githubuser.js", "routes/repo.js", "static/assets/css/main.css", "static/assets/js/app.js", "views/config.html", "views/history.html", "views/index.html" ], "removed": [], "timestamp": "2013-02-02T12:22:55-08:00", "url": "https://github.com/Babelbite/cihub/commit/91b66a30f15db5e3d589b708759428d162f4050b" }, { "added": [], "author": { "email": "joserobleda@gmail.com", "name": "Jose Ignacio Andres", "username": "joserobleda" }, "committer": { "email": "joserobleda@gmail.com", "name": "Jose Ignacio Andres", "username": "joserobleda" }, "distinct": true, "id": "c46fde6782d99a02be900495310a743c3ee48c19", "message": "manage actions", "modified": [ "models/repo.js", "routes/repo.js", "static/assets/css/chosen.css", "views/config.html" ], "removed": [], "timestamp": "2013-02-03T03:03:23-08:00", "url": "https://github.com/Babelbite/cihub/commit/c46fde6782d99a02be900495310a743c3ee48c19" } ], "compare": "https://github.com/Babelbite/cihub/compare/ee250925611c...c46fde6782d9", "created": false, "deleted": false, "forced": false, "head_commit": { "added": [], "author": { "email": "joserobleda@gmail.com", "name": "Jose Ignacio Andres", "username": "joserobleda" }, "committer": { "email": "joserobleda@gmail.com", "name": "Jose Ignacio Andres", "username": "joserobleda" }, "distinct": true, "id": "c46fde6782d99a02be900495310a743c3ee48c19", "message": "manage actions", "modified": [ "models/repo.js", "routes/repo.js", "static/assets/css/chosen.css", "views/config.html" ], "removed": [], "timestamp": "2013-02-03T03:03:23-08:00", "url": "https://github.com/Babelbite/cihub/commit/c46fde6782d99a02be900495310a743c3ee48c19" }, "pusher": { "name": "none" }, "ref": "refs/heads/master", "repository": { "created_at": "2013-02-01T11:43:52-08:00", "description": "Continuous integration based on Github", "fork": false, "forks": 0, "has_downloads": true, "has_issues": true, "has_wiki": true, "id": 7964981, "language": "JavaScript", "name": "cihub", "open_issues": 0, "organization": "Babelbite", "owner": { "email": null, "name": "Babelbite" }, "private": true, "pushed_at": "2013-02-03T03:03:24-08:00", "size": 476, "stargazers": 0, "url": "https://github.com/Babelbite/cihub", "watchers": 0 } };

		req.session.user.getConfigRepo(req.params.repoName, function (err, repo) {
			if (err) return console.log(err);

			repo.getCodeFolder(req.session.user, function (err, file) {
				console.log(err, file);
			});
		})
		///
	});



	app.get('/repo/:owner/:repo/config', function (req, res, next) {
		var user = req.session.user, viewData = req.params.repo;

		viewData.partials = { tab: option };
		viewData.isActiveTab = function (tab) {
			if (this.partials.tab === tab) return 'active';
		};

		
		user.getConfigRepo(req.params.repoName, function (err, repo) {
			if (err) return res.redirect('/error?e=');

			if (repo) viewData.actions = repo.getActions();

			res.render('repo.html', viewData);
		});
	});


	app.get('/repo/:owner/:repo/', function (req, res, next) {
		var user = req.session.user, viewData = req.params.repo;

		viewData.partials = { tab: option };
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
			//	repo.createHook(user);
			};

			res.redirect(req.originalUrl);
		});
	});