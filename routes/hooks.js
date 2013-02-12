	
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


						user.api('/repos/'+ req.params.repoName +'/commits/'+ payload.after, function (err, commitData) {

							// save also the trigger data and checks results
							body.payload = payload;
							body.checks = results;
							body.commit = commitData;

							repo.addEvent(payload.after, body, function (err) {
								if (err) return res.status(500).end();

								//console.log(status);
								res.status(200).end();
							});
						});


					}, status);
				});
				
			}, statuses.pending);
			
		});
	});





	app.get('/repo/:owner/:repo/hook', function (req, res) {
		var payload = { "after": "3b4c4fbdbe0e35c92a884db89a648e09f91a9ee2", "before": "b800378c4dcb051ed6db9dbd71c91dba6f2ab4e1", "commits": [ { "added": [], "author": { "email": "janaya@dokify.net", "name": "janaya", "username": "janayama" }, "committer": { "email": "janaya@dokify.net", "name": "janaya", "username": "janayama" }, "distinct": true, "id": "303eb00b85598b46414075964eb0fa2575f33961", "message": "fix #898", "modified": [ "class/categorizable.class.php" ], "removed": [], "timestamp": "2013-02-11T05:26:06-08:00", "url": "https://github.com/Dokify/dokify/commit/303eb00b85598b46414075964eb0fa2575f33961" }, { "added": [], "author": { "email": "janaya@dokify.net", "name": "janaya", "username": "janayama" }, "committer": { "email": "janaya@dokify.net", "name": "janaya", "username": "janayama" }, "distinct": true, "id": "d16126735519be84be9c31fa348961878ec05b26", "message": "si no hay empresas error sintaxis", "modified": [ "class/solicitable.class.php" ], "removed": [], "timestamp": "2013-02-12T01:22:13-08:00", "url": "https://github.com/Dokify/dokify/commit/d16126735519be84be9c31fa348961878ec05b26" }, { "added": [], "author": { "email": "ldonoso@dokify.net", "name": "Lioba", "username": "LdonosoC" }, "committer": { "email": "ldonoso@dokify.net", "name": "Lioba", "username": "LdonosoC" }, "distinct": true, "id": "3b4c4fbdbe0e35c92a884db89a648e09f91a9ee2", "message": "Merge pull request #899 from Dokify/fix-898\n\nfix #898\r\nPasados test ok", "modified": [ "class/categorizable.class.php", "class/solicitable.class.php" ], "removed": [], "timestamp": "2013-02-12T04:44:27-08:00", "url": "https://github.com/Dokify/dokify/commit/3b4c4fbdbe0e35c92a884db89a648e09f91a9ee2" } ], "compare": "https://github.com/Dokify/dokify/compare/b800378c4dcb...3b4c4fbdbe0e", "created": false, "deleted": false, "forced": false, "head_commit": { "added": [], "author": { "email": "ldonoso@dokify.net", "name": "Lioba", "username": "LdonosoC" }, "committer": { "email": "ldonoso@dokify.net", "name": "Lioba", "username": "LdonosoC" }, "distinct": true, "id": "3b4c4fbdbe0e35c92a884db89a648e09f91a9ee2", "message": "Merge pull request #899 from Dokify/fix-898\n\nfix #898\r\nPasados test ok", "modified": [ "class/categorizable.class.php", "class/solicitable.class.php" ], "removed": [], "timestamp": "2013-02-12T04:44:27-08:00", "url": "https://github.com/Dokify/dokify/commit/3b4c4fbdbe0e35c92a884db89a648e09f91a9ee2" }, "pusher": { "name": "none" }, "ref": "refs/heads/master", "repository": { "created_at": 1331904899, "description": "Dokify", "fork": false, "forks": 3, "has_downloads": true, "has_issues": true, "has_wiki": true, "homepage": "www.dokify.net", "id": 3739190, "language": "PHP", "master_branch": "mainline", "name": "dokify", "open_issues": 67, "organization": "Dokify", "owner": { "email": null, "name": "Dokify" }, "private": true, "pushed_at": 1360687339, "size": 3640, "stargazers": 4, "url": "https://github.com/Dokify/dokify", "watchers": 4 } };
		//var payload = { "after": "52fa0bcb151b772b191fd30342856c608c752fae", "before": "3b5198f2c0c4687e08af8ecdbc1a5385b5764890", "commits": [ { "added": [ "routes/_defines.js", "routes/hooks.js" ], "author": { "email": "joserobleda@gmail.com", "name": "Jose Ignacio Andres", "username": "joserobleda" }, "committer": { "email": "joserobleda@gmail.com", "name": "Jose Ignacio Andres", "username": "joserobleda" }, "distinct": true, "id": "52fa0bcb151b772b191fd30342856c608c752fae", "message": "Varios ajustes", "modified": [ "models/repo.js", "routes/repo.js" ], "removed": [], "timestamp": "2013-02-03T12:11:04-08:00", "url": "https://github.com/Babelbite/cihub/commit/52fa0bcb151b772b191fd30342856c608c752fae" } ], "compare": "https://github.com/Babelbite/cihub/compare/3b5198f2c0c4...52fa0bcb151b", "created": false, "deleted": false, "forced": false, "head_commit": { "added": [ "routes/_defines.js", "routes/hooks.js" ], "author": { "email": "joserobleda@gmail.com", "name": "Jose Ignacio Andres", "username": "joserobleda" }, "committer": { "email": "joserobleda@gmail.com", "name": "Jose Ignacio Andres", "username": "joserobleda" }, "distinct": true, "id": "52fa0bcb151b772b191fd30342856c608c752fae", "message": "Varios ajustes", "modified": [ "models/repo.js", "routes/repo.js" ], "removed": [], "timestamp": "2013-02-03T12:11:04-08:00", "url": "https://github.com/Babelbite/cihub/commit/52fa0bcb151b772b191fd30342856c608c752fae" }, "pusher": { "email": "joserobleda@gmail.com", "name": "joserobleda" }, "ref": "refs/heads/master", "repository": { "created_at": "2013-02-01T11:43:52-08:00", "description": "Continuous integration based on Github", "fork": false, "forks": 0, "has_downloads": true, "has_issues": true, "has_wiki": true, "id": 7964981, "language": "JavaScript", "name": "cihub", "open_issues": 0, "organization": "Babelbite", "owner": { "email": null, "name": "Babelbite" }, "private": true, "pushed_at": "2013-02-03T12:11:15-08:00", "size": 488, "stargazers": 0, "url": "https://github.com/Babelbite/cihub", "watchers": 0 } };
		var url = 'http://'+req.headers.host+'/repo/'+ req.user.getId() +'/'+ req.params.repoName +'/hook';

		request.post({url:url, json:true, body: payload}, function (err) {
			res.end();
		});
	});