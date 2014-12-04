// file simpleServer.js

// fetch the node-static and http modules
var static = require('node-static');
var http = require('http');

var webroot = './public';
var port = 8080;


var file = new static.Server(webroot);

var app = http.createServer(function(request, response){
	file.serve(request, response, function(error, result){
		if (error){
			console.error('Error serving ' + request.url + ' - ' + error.message);
			response.writeHead(error.status, error.headers);
			response.end();
		} else {
			console.log(request.url + ' - ' + result.message);
		}
	});
}).listen(process.env.PORT || port);

console.log('node-static running at http://localhost:%d', process.env.PORT || port);
