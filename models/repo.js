
	var Dbitem = require('babel/models/dbitem');
	var constants = require('babel/lib/constants');
	var fs = require('fs');
	var exec = require('child_process').exec;


	var Repo = Dbitem.extend({
		createHook: function (user) {
			var self = this;

			var data = {
				"name": "web",
				"active": true,
				"events": ["pull_request"],
				"config": {
					"url": "http://domain/hooks/github",
					"content_type": "json"
				}
			};

			user.api('/repos/'+ this.data.repo +'/hooks', function (err, body) {
				if (err) return err;

				self.set('hook', body).save(function (err) {
					if (err) console.log(err);
				});
			}, data);
		},

		getCodeFolder: function (user, cb) {
			var zipName = '/tmp/repo-tarball.zip';
			user.api('/repos/'+ this.data.repo + '/zipball/', function (err) {
				if (err) return cb(err);

				exec("unzip -o -d /tmp/ " + zipName , function (err, stdout, stderr) {
					if (err || stderr) return cb(err || stderr);
					var creating = stdout.split('\n')[2].substring(10);
					var folder = creating.substring(creating.indexOf(' ')+1);
	
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

		getActions: function () {
			var actions = [];
			var availableActions = this.getAvailableActions();

			for (var i in availableActions) {
				if (availableActions.hasOwnProperty(i)) {
					var action = availableActions[i];
					if (this.data.actions && this.data.actions[action.name]) {
						action = this.data.actions[action.name];

						action.date = new Date(action.date);
					};

					actions[i] = action;
				}
			};

			return actions;
		},

		getAvailableActions: function () {
			return [
				{
					name: 'phpunit',
					shell: 'phpunit test'
				},

				{
					name: 'syntax',
					shell: 'syntax check ./'
				}
			];
		}
	});


	Repo.collection = 'repos';
	
	module.exports = Repo;