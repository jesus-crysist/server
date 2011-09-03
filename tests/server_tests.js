/* Tests for server */
var server = require('../server');
var config = require('../config');
var nodeUnit = require('nodeunit');
var http = require('http');
var httputil = nodeUnit.utils.httputil;

//port the test server will listen on
var test_port = "8080";
var test_htmlFolder = '../www'; //Dirty hack untill Jovica fixes absolute paths :)
var test_server;

var config = config.config;
config.port = test_port;
config.htmlFolder = test_htmlFolder; //Also to be removed once abs paths are fixed

/* Server response testing function factory */
function ServerResponseTestFactory(request_params, properties_to_test, expected_values) {
    return nodeUnit.testCase({
        setUp: function (callback) {
            //Start the dummy server
            test_server = server.start(config);   
            callback();
        },

        tearDown: function (callback) {
            test_server.close();
            callback();
        },

        serverTest: function(test) {
            //How many assertions to expect in the test case
            var tests_no = properties_to_test.length, test_cnt;
            console.log(request_params, properties_to_test, expected_values); 
            test.expect(tests_no);
         
            //Create the request object and emmit it 
            var request = http.request(request_params, function(response){
                    //console.log(response);
                    for(test_cnt = 0; test_cnt < tests_no; test_cnt++) {
                        test.equal(response[properties_to_test[test_cnt]], expected_values[test_cnt]);
                    }
                    test.done();
                });
            request.end();

        }
    });
}

/* Test cases start here */
var existant_req_params = { 
    host: "127.0.0.1",
    port: test_port,
    path: "", //Index page in the config file
    method: 'GET'
}
exports['test_existant_url'] = ServerResponseTestFactory(existant_req_params, ['statusCode'], [200]);

var non_existant_req_params = { 
    host: "127.0.0.1",
    port: test_port,
    path: "/DoesNotExist", //Non existant URL
    method: 'GET'
}
exports['test_nonexistant_url'] = ServerResponseTestFactory(non_existant_req_params, ['statusCode'], [404]);

var forbidden_req_params = { 
    host: "127.0.0.1",
    port: test_port,
    path: "../server.js", //File exists but shouldn't be accessed
    method: 'GET'
}
exports['test_forbidden'] = ServerResponseTestFactory(non_existant_req_params, ['statusCode'], [404]);

