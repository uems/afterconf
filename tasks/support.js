'use strict';

var gulp = require('gulp');
var merge = require('event-stream').merge;
var plugins = require('gulp-load-plugins')();

var paths = exports.paths = {
  stylesheets   : [ 'app/modules/**/*.s?ss', 'app/modules/*.scss' ],
  javascripts   : 'app/modules/**/*.js',
  templates     : 'app/modules/**/*.html',
  index         : 'app/index.html',
  statics       : 'app/*.*',
  dist          : 'dist',
};

function streamStylesheets() {
  var self = {};

  var sassParms = {
    errLogToConsole: !plugins.util.env.production,
    includePaths: [ './app' ],
    sourceComments: 'map'
  };

  self.vendor = function() {
    var stream = plugins.bowerFiles()
                        .pipe(plugins.ignore.exclude('**/*.js'))
                        .pipe(plugins.sass(sassParms));

    if (!plugins.util.env.production) { return stream; }

    return stream.pipe(plugins.concat('ac-v.min.css'))
                 .pipe(plugins.minifyCss());
  };
  self.custom = function() {
    var stream = gulp.src(paths.stylesheets)
                     .pipe(plugins.sass(sassParms));

    if (!plugins.util.env.production) { return stream; }

    return stream.pipe(plugins.concat('ac-c.min.css'))
                 .pipe(plugins.minifyCss());
  };
  self.all = function() {
    return merge(self.vendor(), self.custom());
  };

  return self;
}

function streamJavascripts() {
  var self = {};

  self.vendor = function() {
    var stream = plugins.bowerFiles().pipe(plugins.ignore.exclude('**/*.css'));

    if (!plugins.util.env.production) { return stream; }

    return stream.pipe(plugins.concat('ac-v.min.js', { soRrceContent: true }))
                 .pipe(plugins.uglify({ mangle: false }));
  };

  self.custom = function() {
    var stream = gulp.src(paths.javascripts);

    if (!plugins.util.env.production) { return stream; }

    return stream.pipe(plugins.concat('ac-c.min.js', { sourceContent: true }))
                 .pipe(plugins.uglify({ mangle: false }));
  };

  self.all = function() {
    return merge(self.vendor(), self.custom());
  };

  return self;
}

function streamTemplates () {
  return gulp.src(paths.templates)
    .pipe(plugins.angularTemplatecache({ root: 'modules', module: 'templates' }));
}

exports.streams = {
  stylesheets : streamStylesheets(),
  javascripts : streamJavascripts(),
  templates   : streamTemplates,
};


