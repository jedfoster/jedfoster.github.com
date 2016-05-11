var gulp   = require('gulp'),
    moment = require('moment');

require('dotenv').config();


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









/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in gulp/tasks. Any files in that directory get
  automatically required below.

  To add a new task, simply add a new task file that directory.
  gulp/tasks/default.js specifies the default set of tasks to run
  when you run `gulp`.
*/

var requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });

