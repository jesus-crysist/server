/* Tests for server */

var server = require('../server');
var config = require('../config');
var nodeUnit = require('nodeunit');
var http = require('http');
var httputil = nodeUnit.utils.httputil;

var config = config.config;

//port the test server will listen on
var test_port = "8000";

/* Test cases start here */

exports['test_nonexistant_url'] = function(test) {
    /* Test for non-existant url in the config file - check for 404 status code */

    var response_callback = server.response_callback; //the URL routing function of the server
    console.log(config);

    //Start the dummy server
    http.createServer(response_callback).listen(parseInt(test_port, 10));
    
    //Create the reqest object and emmit it 
    var request = http.request( 
        { 
            host: "127.0.0.1",
            port: test_port,
            path: "/DoesNotExist", //Non existant path
            method: 'GET'
        }, function(response){
            console.log(response);
            test.equal(response.statusCode, 404);
        });
        request.end();
    
};
