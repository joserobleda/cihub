	
	var app = require('babel');
	var request = require('babel/lib/request');


	var statuses = {
		pending: { state: 'pending', description: 'Cihub is working...' },
		failure: { state: 'failure', description: 'Some check failed' },
		success: { state: 'success', description: 'Everything is ok' },
	};



	app.post('/repo/:user/:owner/:repo/hook', function (req, res) {
		var user = req.user;

		//console.log("Hook for "+ req.params.repoName + " just recieved");
		var payload = req.body;

		if (JSON.stringify(payload) === '{}') {
			console.log("No payload recieved :(");
			return res.status(500).end();
		};
		
		user.getConfigRepo(req.params.repoName, function (err, repo) {
			if (err) return console.log(err);
			var url = '/repos/'+ req.params.repoName +'/statuses/'+ payload.after;

			user.api(url, function (err) {
				if (err) return req.status(500).end();

				repo.doChecks(user, function (err, results) {
					if (err) return req.status(500).end();
					
					var status = statuses.success;
					var checks = [];

					for (var i in results) {
						if (results.hasOwnProperty(i)) {
							var result = results[i];

							if (result.err && result.err.code) {
								status = statuses.failure;
							}
						}
					}

					status.target_url = "http://"+ req.headers.host +'/repo/'+ req.params.repoName +'/'+ payload.after;


					user.api(url, function (err, body) {
						if (err) return res.status(500).end();

						// save also the trigger data and checks results
						body.payload = payload;
						body.checks = results;

						repo.addEvent(payload.after, body, function (err) {
							if (err) return res.status(500).end();

							//console.log(status);
							res.status(200).end();
						});
					}, status);
				});
				
			}, statuses.pending);
			
		});
	});





	app.get('/repo/:owner/:repo/hook', function (req, res) {
		var payload = { "after": "52fa0bcb151b772b191fd30342856c608c752fae", "before": "3b5198f2c0c4687e08af8ecdbc1a5385b5764890", "commits": [ { "added": [ "routes/_defines.js", "routes/hooks.js" ], "author": { "email": "joserobleda@gmail.com", "name": "Jose Ignacio Andres", "username": "joserobleda" }, "committer": { "email": "joserobleda@gmail.com", "name": "Jose Ignacio Andres", "username": "joserobleda" }, "distinct": true, "id": "52fa0bcb151b772b191fd30342856c608c752fae", "message": "Varios ajustes", "modified": [ "models/repo.js", "routes/repo.js" ], "removed": [], "timestamp": "2013-02-03T12:11:04-08:00", "url": "https://github.com/Babelbite/cihub/commit/52fa0bcb151b772b191fd30342856c608c752fae" } ], "compare": "https://github.com/Babelbite/cihub/compare/3b5198f2c0c4...52fa0bcb151b", "created": false, "deleted": false, "forced": false, "head_commit": { "added": [ "routes/_defines.js", "routes/hooks.js" ], "author": { "email": "joserobleda@gmail.com", "name": "Jose Ignacio Andres", "username": "joserobleda" }, "committer": { "email": "joserobleda@gmail.com", "name": "Jose Ignacio Andres", "username": "joserobleda" }, "distinct": true, "id": "52fa0bcb151b772b191fd30342856c608c752fae", "message": "Varios ajustes", "modified": [ "models/repo.js", "routes/repo.js" ], "removed": [], "timestamp": "2013-02-03T12:11:04-08:00", "url": "https://github.com/Babelbite/cihub/commit/52fa0bcb151b772b191fd30342856c608c752fae" }, "pusher": { "email": "joserobleda@gmail.com", "name": "joserobleda" }, "ref": "refs/heads/master", "repository": { "created_at": "2013-02-01T11:43:52-08:00", "description": "Continuous integration based on Github", "fork": false, "forks": 0, "has_downloads": true, "has_issues": true, "has_wiki": true, "id": 7964981, "language": "JavaScript", "name": "cihub", "open_issues": 0, "organization": "Babelbite", "owner": { "email": null, "name": "Babelbite" }, "private": true, "pushed_at": "2013-02-03T12:11:15-08:00", "size": 488, "stargazers": 0, "url": "https://github.com/Babelbite/cihub", "watchers": 0 } };
		var url = 'http://'+req.headers.host+'/repo/'+ req.user.getId() +'/'+ req.params.repoName +'/hook';

		request.post({url:url, json:true, body: payload}, function (err) {
			res.end();
		});
	});