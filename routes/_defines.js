
	var app = require('babel');

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