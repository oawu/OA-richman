var gulp = require ('gulp'),
    livereload = require('gulp-livereload'),
    uglifyJS = require ('gulp-uglify'),
    del = require('del'),
    htmlmin = require('gulp-html-minifier');

gulp.task ('default', function () {
  livereload.listen ();

  ['./root/*.html', './root/css/**/*.css', './root/res/**/*.js', './root/js/**/*.js'].forEach (function (t) {
    gulp.watch (t).on ('change', function () {
      gulp.run ('reload');
    });
  });
});

gulp.task ('reload', function () {
  livereload.changed ();
  console.info ('\nReLoad Browser!\n');
});

gulp.task ('minify', function () {
  gulp.run ('js-uglify');
  gulp.run ('res-uglify');
  gulp.run ('minify-html');
});

gulp.task ('gh-pages', function () {
  del (['./root']);
});
gulp.task ('js-uglify', function () {
  gulp.src ('./root/js/*.js')
      .pipe (uglifyJS ())
      .pipe (gulp.dest ('./root/js/'));
});
gulp.task ('minify-html', function () {
  gulp.src ('./root/*.html')
    .pipe (htmlmin ({collapseWhitespace: true}))
    .pipe (gulp.dest ('./root/'));
});
gulp.task ('res-uglify', function () {
  gulp.src ('./root/res/**/*.js')
      .pipe (uglifyJS ())
      .pipe (gulp.dest ('./root/res/'));
});