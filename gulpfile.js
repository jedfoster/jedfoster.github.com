var gulp   = require('gulp'),
    harp   = require('harp'),
    moment = require('moment'),
    uglify = require('gulp-uglify');


// this line, although dirty, ensures that Harp templates
// have access to moment - which given the whole partial
// import hack doesn't work consistently across dynamic vs
// compiled, this is the cleanest solution.
global.moment = moment;

global.helpers = {
  xmlSchemaDate: function(date) {
    return moment(date).format('YYYY-MM-DDTHH:mm:ssZ')
  },
  shortDate: function(date) {
    return moment(date).format('MMM D, YYYY')
  },
  relatedPosts: function(posts, current, limit) {
    var sortedPosts = [];

    limit = limit || 3;
    current = JSON.stringify(current);

    posts.forEach(function(item, i, a) {
      if(JSON.stringify(item) !== current) {
        sortedPosts.push(item);
      }
    });

    return sortedPosts.slice(0, limit);
  }
};

gulp.task('serve', function() {
  harp.server(__dirname + '/public', {
    port: 9000
  })
});

gulp.task('build', function(done) {
  process.env.NODE_ENV = 'production';

  harp.compile(__dirname + '/public', __dirname + '/www', function(errors) {
    if(errors) {
      console.log(JSON.stringify(errors, null, 2));
      process.exit(1);
    }
    
    return gulp.src(__dirname + '/www/js/*.js')
      .pipe(uglify({
        mangle: true,
        compress: true,
        preserveComments: 'some'
      }))
      .pipe(gulp.dest(__dirname + '/www/js'));
  });
});

// Alias `gulp build` as `gulp compile`
gulp.task('compile', ['build']);

gulp.task('default', ['serve']);

