
	var request = require('babel/lib/request');
	var promises = require("babel/lib/promises");
	var Dbitem = require('babel/models/dbitem');
	var Repo = require('./repo');
	var Deferred = promises.Deferred;


	var Githubuser = Dbitem.extend({

		getHooks: function (repo, cb) {
			this.api('/repos/'+repo+'/hooks', cb);
		},

		getOrganizations: function (cb) {
			this.api('/user/orgs', cb);
		},

		getAllRepos: function (cb) {
			var self = this;

			this.getRepos(function (err, repos) {
				if (err || (repos && repos.message)) return cb(err || repos.message);

				self.getOrganizations(function (err, orgs) {
					if (err || (orgs && orgs.message)) return cb(err || orgs.message);

					orgs.pipe(function (org, cb) {
						self.getOrgRepos(org.login, cb);
					}).then(function (orgs) {
						for (var i in orgs) {
							if (orgs.hasOwnProperty(i)) repos.merge(orgs[i]);
						}

						//console.log(repos);
						cb(null, repos);
					});
				});
			});
		},

		getConfigRepo: function (repo, cb) {
			Repo.findOne({ repo:repo }, cb);
		},

		getRepos: function (cb) {
			this.api('/user/repos', function(err, repos) {
				if (err) return cb(err);
				cb(null, repos);
			});
		},

		getOrgRepos: function(orgname, cb) {
			//console.log('/orgs/'+orgname+'/repos');
			this.api('/orgs/'+orgname+'/repos', function (err, repos) {
				if (err) return cb(err);
				cb(null, repos)
			})
		},

		api: function (path, cb, data) {
			var url = 'https://api.github.com'+ path + '?access_token=' + this.data.access_token;

			if (data) {
				if (data === 'delete') {
					return request.del({url:url, json:true}, function (err, res, body) {
						if (err) return cb(err);
						cb(null, body, res);
					});
				}

				return request.post({url:url, json:true, body: data}, function (err, res, body) {
					if (err || body.error) return cb(err || new Error(body.error));
					cb(null, body, res);
				});

			} else {
				return request.get({url:url, json:true}, function (err, res, body) {
					if (err || body.error) return cb(err || new Error(body.error));
					cb(null, body, res);
				});
			}
		}
	});


	Githubuser.collection = 'users';
	
	module.exports = Githubuser;