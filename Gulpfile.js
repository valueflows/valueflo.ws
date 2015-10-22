var gulp = require('gulp')
var File = require('vinyl')
var Swig = require('swig').Swig
var data = require('gulp-data')
var markdown = require('markdown-it')()
var through = require('through2')
var map = require('through2-map')
var buffer = require('vinyl-buffer')
var replaceExt = require('replace-ext')
var assign = require('object-assign')
var Path = require('path')
var prettify = require('gulp-prettify')
var push = Array.prototype.push

function docs () {
  var swig = new Swig()
  var renderDoc = swig.compileFile('./templates/doc.swig')

  return gulp.src('./docs/*.md')
    .pipe(buffer())
    .pipe(data(getData))
    .pipe(map.obj(function toMarkdown (file) {
      var input = String(file.contents)
      var output = markdown.render(input)
      file.contents = Buffer(output)
      file.path = replaceExt(file.path, '.html')
      return file
    }))
    .pipe(map.obj(function toTemplate (file) {
      var input = String(file.contents)
      var locals = assign({}, file.data, { contents: input })
      var output = renderDoc(locals)
      file.contents = Buffer(output)
      return file
    }))
    .pipe(prettify())
    .pipe(gulp.dest('./.build'))

  function getData (file) {
    return require(file.path + '.json')
  }
}

function ns () {

  gulp.src('./ns/*.jsonld')
    // bundle into a single context at index.jsonld
    .pipe(bundleContext())
    .pipe(gulp.dest('./.build/ns'))

  function bundleContext () {
    var bundle = {
      '@context': {},
      '@graph': []
    }
    var base = null

    return through.obj(function bundleContext (file, enc, cb) {
      //console.log("spying", file)
      if (!base) {
        base = file.base
      }
      var input = JSON.parse(file.contents)
      if (Array.isArray(input['@context'])) {
        input['@context'].forEach(function (item) {
          mix(bundle['@context'], item)
        })
      } else {
        mix(bundle['@context'], input['@context'])
      }
      push.apply(bundle['@graph'], input['@graph'])
      cb(null, file)
    }, function writeContext (cb) {
      var path = Path.join(base, 'index.jsonld')
      var contents = new Buffer(JSON.stringify(bundle, null, 2))
      //console.log("writing", path, contents)
      this.push(new File({
        path: path,
        base: base,
        cwd: process.cwd(),
        contents: contents
      }))
      cb(null)
    })

    function mix (bundle, input) {
      switch (typeof input) {
        case 'string':
          // TODO fetch from url and re-mix
          break
        case 'object':
          assign(bundle, input)
          break
      }
    }
  }
}

function css () {
  gulp.src('./css/*.css')
    .pipe(gulp.dest('./.build/css'))
}

function server () {
  gulp.src(['./server.js', './package.json'])
    .pipe(gulp.dest('./.build'))
}

function assets () {
  gulp.src('./assets/**/*')
    .pipe(gulp.dest('./.build'))
}

gulp.task('docs', docs)
gulp.task('ns', ns)
gulp.task('css', css)
gulp.task('assets', assets)
gulp.task('server', server)
 
gulp.task('build', ['docs', 'ns', 'css', 'assets', 'server'])
