/*
Basic async logging for the server.

For usage example see server.js:
*/

var util = require('util');
var events = require('events');
var http = require('http');
var fs = require('fs');

var config = require('./config').config;

var default_logfile = './server.log';

/* 
Function that passes the values from the request object in the propper places in the template string.
Read more on template strings in the example config file - config.js

At present only supports a subset of headers
*/

var request_params = ['method', 'url', 'httpVersion'];
var header_params = ['host', 'user-agent', 'accept', 'accept-language', 'accept-encoding', 'accept-charset', 'referer', 'cookie', 'cache-control']

//Params that can be retrieved by calling a specific function 
//insted of just mapping it on the reuest object or it's headers
var other_params = {
    'remoteAddress' : function(req) { return req.connection.remoteAddress }
}; 

function parse_log_template_string(template, request) {
    var ret_string = template;

    //Function to replace a string parameter
    var replace = function(str, param, value) {
        regex = new RegExp('{' + param + '}', 'g');
        return str.replace(regex, value);
    };
        
    request_params.forEach(function(item) {
        ret_string = replace(ret_string, item, request[item]);
    });

    header_params.forEach(function(item) {
        ret_string = replace(ret_string, item, request.headers[item]);
    });

    for(var param in other_params) {
        ret_string = replace(ret_string, param, other_params[param](request)); 
        //ret_string = ret_string.replace(regex, request[prop] instanceof String ? request[prop] : JSON.stringify(request[prop]));
    }
    //console.log(ret_string);
    return ret_string;
}

/* Constructor of a new EventEmitter object that will have the logging funtionality */
function Logger() {
    events.EventEmitter.call(this); //Not needed but kept for clarity
    
    this.logfile = fs.createWriteStream(config.logfile ? config.logfile : default_logfile, {flags : "a"}); //Open the logfile as a WriteStream

    this.log_request = function(request) {
        //Emmits the log request event 
        this.emit('log_request', request);
    };

    //Register an even thandler for the log request
    this.on('log_request', function(request) {
        var date = new Date();
        this.logfile.write('[' + date + '] ' + parse_log_template_string(config.log_template, request) + '\n');
    });
};

util.inherits(Logger, events.EventEmitter);

exports.logger = new Logger();
