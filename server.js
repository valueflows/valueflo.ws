var finalhandler = require('finalhandler')
var http = require('http')
var https = require('https')
var serveStatic = require('serve-static')
var Cors = require('http-cors')
var Url = require('url')

var ghPages = {
  '/linked-data-browser': 'https://valueflows.github.io/linked-data-browser'
}

var cors = new Cors()
var serve = serveStatic(__dirname)
 
var server = http.createServer(function(req, res){
  var done = finalhandler(req, res)

  if (cors.apply(req, res))
    return; // this was an OPTIONS request - no further action needed

  for (var pageUrl in ghPages) {
    var pageUrlIndex = req.url.indexOf(pageUrl)
    if (pageUrlIndex === 0) {
      var ghPagesUrl = ghPages[pageUrl] + req.url.slice(pageUrl.length)
      return proxy(ghPagesUrl)(req, res, done)
    }
  }

  serve(req, res, done)
})
 
server.listen(process.env.PORT || 3000)

function proxy (to) {
  return function (req, res, done) {
    var urlObj = Url.parse(to)

    var options = {
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      port: urlObj.port,
      method: req.method,
      path: urlObj.path,
      headers: req.headers
    }
    options.headers.host = options.hostname

    var request = (urlObj.protocol === 'https:' ? https : http).request

    request(options, function (pes) {
      res.writeHead(pes.statusCode, pes.headers)
      pes.pipe(res)
    })
    .on('error', done)
    .end()
  }
}
