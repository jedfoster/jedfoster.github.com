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

