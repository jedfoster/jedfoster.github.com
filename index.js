'use strict';

var http = require('http');
var harp = require('harp');
var outputPath = __dirname + '/www';
var port = process.env.PORT || 9000;
var router = require('router-stupid');
var blogs = require('./public/blog/_data.json');
var route = router();
var moment = require('moment');

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

function run() {
  route.all('*', harp.mount(__dirname + '/public'));

  console.log('Running harp-static on ' + port);
  http.createServer(route).listen(port);
}

if (process.argv[2] === 'compile') {
  process.env.NODE_ENV = 'production';
  harp.compile(__dirname + '/public', outputPath, function(errors){
    if(errors) {
      console.log(JSON.stringify(errors, null, 2));
      process.exit(1);
    }

    process.exit(0);
  });
} else {
  run();
}

