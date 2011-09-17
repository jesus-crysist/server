var config = {

	contentType: {
		'html' : 'text/html',
		'css' : 'text/css',
		'js' : 'text/javascript'
	},
	
	htmlFolder: 'www',
	
	paths: [
		{
			urls: [ '', 'index', 'index.html' ],
			file: 'index.html'
		}
	],
	
	port: 8000,

    //Log file settings
    logfile : undefined,
    log_template : '{url} {method} {accept} {user-agent} {remoteAddress}',
};

exports.config = config;
