
	var app = require('babel');

	app.define({
		DBNAME: 'cihub',
		GITHUB_PUBLIC: '5acac9cd411b86eaf822',
		GITHUB_SECRET: 'a519e6b92d4d8bbf0cbcb826c713b599871c58d2'
	});

	app.configure('production', function(){
		app.define({
			PROTOCOL: 'http:',
			DOMAIN: 'cihub.babelbite.com',
			PORT: 3001
		});
	});
	
	app.configure('development', function(){
		app.define({
			PROTOCOL: 'http:',
			DOMAIN: 'localhost',
			PORT: 3001
		});
	});

	app.start();