
	var Dbitem = require('babel/models/dbitem');
	var constants = require('babel/lib/constants');
	//var request = require()


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