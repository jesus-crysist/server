var http = require('http');
var fs = require('fs');
var router = require('./router');

var logger = require('./logger').logger;
var config, folder, resolveFile;


function startServer(cfg) {
	config = cfg;
//	console.log(config);
//    folder = config.htmlFolder;
	folder = router.resolveRootDir(config.siteRoot, fs);
	console.log('root dir:', folder);
	resolveFile = router.resolveFile(folder, config.paths);
    
    //Return server object - needed for tests
	server = http.createServer(response);
    server.listen(cfg.port);
    return server;
}

function response (req, res) {
	var file, statusCode, path;

    //Log the request 
    logger.log_request(req);
	
	file = resolveFile(req.url);
	
    if (file) {
        sendResponse(res, 200, file);
	} else {
		throwError(res, 404);
	}
		
	res.end();
}

function readFile(path) {
	return fs.readFileSync(path);
}

function sendResponse(res, statusCode, file) {

    var path, fileExt, contType, fileBuff;
    
    path = folder + file;
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
