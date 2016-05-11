var gulp   = require('gulp'),
    config = require('../config').harp,
    harp   = require('harp');

gulp.task('serve', function() {
  console.log('Server starting at http://localhost:' + config.port);
  harp.server(config.src, {
    port: config.port
  }, function() { /* no-op */ })
});

