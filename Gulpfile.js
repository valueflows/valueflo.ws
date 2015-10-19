var gulp = require('gulp')
var Swig = require('swig').Swig
var data = require('gulp-data')
var markdown = require('markdown-it')()
var map = require('through2-map')
var buffer = require('vinyl-buffer')
var replaceExt = require('replace-ext')
var assign = require('object-assign')
var prettify = require('gulp-prettify')

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
    .pipe(gulp.dest('./.build/ns'))
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
