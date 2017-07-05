var http = require('http');

http.createServer(function(request, response) {

  //if (request.method === 'GET' && request.url === '/echo') {

  if (request.method === 'PUT' && request.url === '/echo') {
//   request.on('data', function(chunk) {
//   body.push(chunk);
// }).
    request.pipe(response);
  } else {
    response.statusCode = 404;
    response.end();
  }
}).listen(8080);
