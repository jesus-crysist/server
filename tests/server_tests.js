/* Tests for server */

var server = require('../server');
var config = require('../config');
var nodeUnit = require('nodeunit');
var httputil = nodeUnit.utils.httputil;

var test_config = config.config;

/* Test cases start here */

exports['test_nonexistant_url'] = function(test) {
    /* Test for non-existant url in the config file - check for 404 status code */
    var router = server.response; //the URL routing function of the server
    
    console.log(server);
    
    //Use httputil to spoof the server
    httputil(router, function(server, client) {
        client.fetch('GET', 'thisurldoesnotexist', {}, function(response) {
            test.equal(404, response.statusCode); //Status code must be 404
        });
    });
    
};
