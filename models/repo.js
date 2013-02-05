
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
				var actions = self.getActions(true);

				actions.pipe(function (action, cb) {
					var cmd = 'cd '+ dir +' && ' + action.shell;
					exec(cmd, function (err, stdout, stderr) {
						cb({
							action:action,
							err:err,
							stdout: stdout,
							stderr: stderr
						});
					});

				}).then(function(results) {
					cb(null, results);
				});

			});
		},

		getCodeFolder: function (user, cb) {
			var zipName = '/tmp/repo-tarball.zip';
			user.api('/repos/'+ this.data.repo + '/zipball/', function (err) {
				if (err) return cb(err);

				exec("unzip -o -d /tmp/ " + zipName , function (err, stdout, stderr) {
					if (err || stderr) return cb(err || stderr);
					var first = stdout.split('\n')[2].trim();
					var fullpath = first.substring(first.indexOf(' ')+1);
					var folder = fullpath.substring(0, fullpath.indexOf('/', 5));
	
					cb(err, folder);
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
					shell: 'phpunit test/'
				},

				{
					name: 'npm test',
					shell: 'npm test'
				}
			];
		}
	});


	Repo.collection = 'repos';
	
	module.exports = Repo;