/**
 * Resolves absolute path to the site dir with given path (relative, absolute or home relative) in config object.
 * @param configDir {String} path from config object
 * @return {String} absolute path to the site dir
 */
exports.resolveRootDir = function resolveRootDir(configDir, fs) {
	if (!configDir) { return './www'; }
	var dir = '';
	if (configDir.indexOf('~') === 0) { // home dir relative path
		// home dir
		dir = process.env.HOME + configDir.slice(1);
	} else { // apsolute or relative path
		dir = configDir;
	}
	dir = fs.realpathSync(dir);
	return dir + '/';
}

exports.resolveFile = function resolveFile(root, pathArr) {
	var paths = pathArr;
	
	return function (url) {
		var i, len, subpaths, j, sublen, path;
		
		if (url.indexOf('..') === 0) { return; }
		
		url = url.substring(1);
		
		console.log('url', '"' + url + '"');
		
		for (i = 0, len = paths.length; i < len; i += 1) {
			path = paths[i];
			subpaths = path.urls;
//			console.log(subpaths);
		
			for (j = 0, sublen = subpaths.length; j < sublen; j += 1) {
//				console.log(subpaths[j], subpaths[j] === url);
				if (subpaths[j] === url) {
//					console.log('match');
					return path.file;
				}
			}
		}
		
		return url;
	};
}
