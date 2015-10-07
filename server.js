var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')
 
var serve = serveStatic(__dirname)
 
var server = http.createServer(function(req, res){
  var done = finalhandler(req, res)
  serve(req, res, done)
})
 
server.listen(process.env.PORT || 3000)
