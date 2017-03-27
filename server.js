var http = require('http')
var https = require('https')
var Url = require('url')
var redirect = require('redirekt')

var home = 'https://www.valueflo.ws'
var ghPages = {
  '/linked-data-browser': 'https://valueflows.github.io/linked-data-browser'
}

var server = http.createServer(function(req, res){
  for (var pageUrl in ghPages) {
    var pageUrlIndex = req.url.indexOf(pageUrl)
    if (pageUrlIndex === 0) {
      var ghPagesUrl = ghPages[pageUrl] + req.url.slice(pageUrl.length)
      return redirect(req, res, ghPagesUrl)
    }
  }

  redirect(req, res, home)
})
 
server.listen(process.env.PORT || 3000)
