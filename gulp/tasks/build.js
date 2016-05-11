var gulp   = require('gulp'),
    config = require('../config').harp,
    harp   = require('harp'),
    uglify = require('gulp-uglify');

gulp.task('build', function(done) {
  process.env.NODE_ENV = 'production';

  harp.compile(config.src, config.dest, function(errors) {
    if(errors) {
      console.log(JSON.stringify(errors, null, 2));
      process.exit(1);
    }

    return gulp.src(config.dest + '/js/*.js')
      .pipe(uglify({
        mangle: true,
        compress: true,
        preserveComments: 'some'
      }))
      .pipe(gulp.dest(config.dest + '/js'));
  });
});

// Alias `gulp build` as `gulp compile`
gulp.task('compile', ['build']);

