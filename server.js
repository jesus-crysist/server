var http = require('http');
var fs = require('fs');
var config;
var folder;

var testing_on = true; //Needed in order to export more stuff than needed for normal running of the server

function startServer(cfg) {
	config = cfg;
//	console.log(config);
    folder = config.htmlFolder;
	http.createServer(response).listen(cfg.port);
}

function response (req, res) {
	var file, statusCode, path;
	
	file = resolveFile(req.url);
	
    if (file) {
        sendResponse(res, 200, file);
	} else {
		throwError(res, 404);
	}
		
	res.end();
}

function resolveFile(url) {
		
	var paths = config.paths,
		i, len, subpaths, j, sublen, path;
		
	url = url.substring(1);
		
	console.log('url', '"' + url + '"');
		
	for (i = 0, len = paths.length; i < len; i += 1){
		path = paths[i];
		subpaths = path.urls;
//			console.log(subpaths);
		
		for (j = 0, sublen = subpaths.length; j < sublen; j += 1) {
//			console.log(subpaths[j], subpaths[j] === url);
			if (subpaths[j] === url) {
//				console.log('match');
				return path.file;
			}
		}
	}
	
	return url;
}

function readFile(path) {
	return fs.readFileSync(path);
}

function sendResponse(res, statusCode, file) {

    var path, fileExt, contType, fileBuff;
    
    path = './' + folder + (folder.lastIndexOf('/') === folder.length-1 ? '' : '/') + file;
    fileExt = file.substring(file.lastIndexOf('.') + 1);
    contType = config.contentType[fileExt];

//	console.log(folder, file, fileExt, path, contType);
//	console.log('--------------');
    
	res.writeHead(statusCode, { 'Content-Type': contType });
    
    try {
	    fileBuff = readFile(path);
	    res.write(fileBuff);
	} catch (ex) {
        throwError(res, 404);
    }
}

function throwError(res, code) {
    
    var file;
	if (code === 404) {
	    file = '404.html';
    } else if (code === 500) {
        file = '500.html';
    }

    sendResponse(res, code, file);
}

exports.start = startServer;

//Export the following only if the testing flag is on
if(testing_on) {
    exports.response_callback = response;
}
