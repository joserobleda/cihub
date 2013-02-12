
	var app = require('babel');
	var constants = app.constants;
	var Dbitem = require('babel/models/dbitem');
	var constants = require('babel/lib/constants');
	var fs = require('fs');
	var exec = require('child_process').exec;


	var Repo = Dbitem.extend({
		createHook: function (user, cb) {
			cb = cb || function() {};
			var self = this;

			var url = constants.PROTOCOL + '//' + constants.DOMAIN + '/repo/'+ user.getId()+ '/' + this.data.repo + '/hook';

			var data = {
				"name": "web",
				"active": true,
				"events": ["push"],
				"config": {
					"url": url,
					"content_type": "json"
				}
			};

			user.api('/repos/'+ this.data.repo +'/hooks', function (err, body) {
				if (err) return cb(err);

				self.set('hook', body).save(function (err) {
					if (err) return cb(err);
					cb(null);
				});
			}, data);
		},

		removeHook: function (user, cb) {
			var hook = this.data.hook, url = '/repos/'+ this.data.repo +'/hooks/' +hook.id;

			user.api(url, function (err, body) {
				if (err) return cb(err);

				cb(null);
			}, 'delete');
		},

		addEvent: function (ref, data, cb) {
			var events = this.data.events || {};
			events[ref] = data;

			var eventList = this.data.eventList || [];
			eventList.push(ref);

			this.set({'events': events, 'eventList': eventList}).save(cb);
		},


		doChecks: function(user, cb) {
			var self = this;

			this.getCodeFolder(user, function (err, dir) {
				if (err) return cb(err);
				var actions = self.getActions(true);

				actions.pipe(function (action, cb) {
					var precmd = 'cd '+ dir +' && ' + action.pre;
					
					// prepare test
					exec(precmd, function (err, stdout, stderr) {
						var cmd = 'cd '+ dir +' && ' + action.shell;
						
						// run test
						exec(cmd, function (err, stdout, stderr) {

							// remove folder
							exec('rm -R '+ dir, function (err) {
								cb({
									action:action,
									err:err,
									stdout: stdout.trim(),
									stderr: stderr.trim()
								});
							});
						});
					});
				}).then(function(results) {
					cb(null, results);
				});

			});
		},

		getCodeFolder: function (user, cb) {
			var fileName = this.data.repo.replace('/', '-');
			var zipName = '/tmp/'+ fileName +'-tarball.zip';
			user.api('/repos/'+ this.data.repo + '/zipball/', function (err) {
				if (err) return cb(err);

				// Get folder name
				exec("unzip -z " + zipName, function (err, stdout) {
					var versionName = stdout.split('\n')[1].trim();
					var folder = '/tmp/'+ fileName +'-'+ versionName;

					// Extract the file
					exec("unzip -q -o -d /tmp/ " + zipName, function (err, stdout, stderr) {
						if (err || stderr) return cb(err || stderr);

						// remove zip file
						exec("rm "+ zipName, function (err, stdout, stderr) {
							cb(err, folder);
						});
					});
				});


			}).pipe(fs.createWriteStream(zipName));
		},

		setActions: function (actions, cb) {
			var configActions = {};
			var availableActions = this.getAvailableActions();

			for (var i in availableActions) {
				if (availableActions.hasOwnProperty(i)) {
					var action = availableActions[i];
					if (actions && actions[action.name]) {

						action.date = (new Date()).getTime();

						// save
						configActions[action.name] = action;
					}
				}
			}

			this.set('actions', configActions).save(cb);
		},

		getActions: function (actived) {
			var actions = [];
			var availableActions = this.getAvailableActions();

			for (var i in availableActions) {
				if (availableActions.hasOwnProperty(i)) {
					var action = availableActions[i];
					if (this.data.actions && this.data.actions[action.name]) {
						action = this.data.actions[action.name];

						action.date = new Date(action.date);

						if (actived) actions[i] = action;
					};

					if (!actived) actions[i] = action;
				}
			};

			return actions;
		},

		getAvailableActions: function () {
			return [
				{
					name: 'phpunit',
					pre: 'cd /tmp',
					shell: 'phpunit test/'
				},

				{
					name: 'npm test',
					pre: 'npm install',
					shell: 'npm test'
				}
			];
		}
	});


	Repo.collection = 'repos';
	
	module.exports = Repo;