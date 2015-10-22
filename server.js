var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')
var Cors = require('http-cors')

var cors = new Cors()
var serve = serveStatic(__dirname)
 
var server = http.createServer(function(req, res){
  var done = finalhandler(req, res)

  if (cors.apply(req, res))
    return; // this was an OPTIONS request - no further action needed

  serve(req, res, done)
})
 
server.listen(process.env.PORT || 3000)
