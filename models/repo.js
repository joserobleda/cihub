
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
		}
	});


	Repo.collection = 'repos';
	
	module.exports = Repo;