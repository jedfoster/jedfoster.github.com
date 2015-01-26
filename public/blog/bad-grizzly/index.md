Lately, there's been a lot of momentum around full-stack JavaScript apps; so last year, when my friend [@anotheruiguy](https://twitter.com/anotheruiguy) asked me speak to his class at [Code Fellows](https://www.codefellows.org/) on Node.js and Ember, I took it as a challenge to explore some technologies that I had previously only played with. 

This is a detailed, step-by-step guide to building a single-page application (SPA) backed by a micro-service API. I'll walk through bootstrapping a barebones Node server, from `npm-init` through constructing a JSON API, using TDD along the way. We'll explore some neat features of npm, Bower, Express, and Jade. With our API in place, we'll use Ember and Handlebars to build the UI and handle the interaction with the API. We'll use Ember Data, build models, routes, and controllers; and we'll do it all _in under 200 lines of code_. It'll be fun!


## TL;DR

[Fork the app on GitHub.](https://github.com/jedfoster/bad-grizzly)

[See the app in action.](http://bad-grizzly.herokuapp.com)

[View this article as a slide deck.](/bad-grizzly)


### About the name

I couldn't think of anything clever, so I used [projectcodename.com](http://projectcodename.com/) to generate a cool name. You should totally use it next time you need to name a project.


---


## Planning the app

Because it's a domain I know well, we're going to make a simple clone of [SassMeister.com](http://sassmeister.com).

The basic flow of our app will be:

1. A user enters Sass code into a text area
2. The client-side Ember app will post the input to server via AJAX
3. The server will process the input and respond with a JSON object containing the rendered CSS output
4. Ember will render the returned JSON in a template on our page
5. Profit



## File structure

Keeping your code organized makes your life easy. It's easier to maintain a mental model of your app, and it's easier to debug when things go wrong.

The importance of proper code organization is hard to overstate, yet, I can't find an official, canonical file structure for a Node.js project, so I've had to make my own.

This is the file structure I favor currently for Node projects. It borrows heavily from Rails.

```
app/
  controllers/
  index.js
  views/
config/
node_modules/
package.json
public/
  css/
  js/
test/
```

## npm-init

Keeping this structure in mind, it's time to init this thing:

```
$ npm init
```
    
This launches an interactive wizard that will help us create a `package.json` file. This is where we declare important information about our project, including what other projects we depend on.

```
$ npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sane defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg> --save` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
name: (bad-grizzly)
```

First step is a name:

```
name: (bad-grizzly)
```

`npm-init` makes some suggestions about some options, which it shows in parentheses: e.g.: `(bad-grizzly)` To accept the suggestion, just hit `Enter`.

Let's accept the suggested name.

Next, version:

```
version: (0.0.0)
```
    
Again, this suggestion looks fine for now; we can always edit `package.json` later.

```
description:
```
    
It's too early for us to know what our project is going to be, so let's leave this option blank for now.

```
entry point: (index.js)
```
    
The entry point tells others (people and packages) where to find the main file of your app.

Here's where the file structure I outline above comes into play. Take a look at the `app` directory:

```
app/
  controllers/
  index.js
  views/
```

That `app/index.js` file is the main file for our app. So let's enter that now:

```
entry point: (index.js) app/index.js
```
    
This won't actually create `app/index.js`—we'll still need to do that manually later.

For the remaining options in the wizard, let's accept the suggestions or leave them blank. (Just keep hitting `Enter`. :-)

Now we have `package.json` at the root of our project. Here's what it looks like:

```
$ cat package.json
{
  "name": "bad-grizzly",
  "version": "0.0.0",
  "description": "bad-grizzly ===========",
  "main": "app/index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/jedfoster/bad-grizzly.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/jedfoster/bad-grizzly/issues"
  },
  "homepage": "https://github.com/jedfoster/bad-grizzly"
}
```

Look at that description; we left that field blank, but `npm-init` entered a value for us. Ok, then.

Looks good.



## Stupid npm tricks

Did you see that `scripts` section of `package.json`?

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

This object exposes additional `npm` commands; the key is an `npm` command, and the value is either a shell command or the path to a script. There's a [whole slew of valid commands](https://www.npmjs.org/doc/misc/npm-scripts.html), but we're only interested in one right now, `start`.

Let's add an item to this object:

```json
"scripts": {
  "start": "node app/index.js",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

Now, we've essentially aliased the command that will launch our app, `node app/index.js` to `npm start`. Let's give it whirl:

```
$ npm start

> bad-grizzly@0.0.0 start /Users/ember/Dropbox/Code/bad-grizzly
> node app/index.js


module.js:340
    throw err;
          ^
Error: Cannot find module '/Users/ember/Dropbox/Code/bad-grizzly/app/index.js'
    at Function.Module._resolveFilename (module.js:338:15)
    at Function.Module._load (module.js:280:25)
    at Function.Module.runMain (module.js:497:10)
    at startup (node.js:119:16)
    at node.js:906:3

npm ERR! bad-grizzly@0.0.0 start: `node app/index.js`
npm ERR! Exit status 8
npm ERR!
npm ERR! Failed at the bad-grizzly@0.0.0 start script.
npm ERR! This is most likely a problem with the bad-grizzly package,
npm ERR! not with npm itself.
npm ERR! Tell the author that this fails on your system:
npm ERR!     node app/index.js
npm ERR! You can get their info via:
npm ERR!     npm owner ls bad-grizzly
npm ERR! There is likely additional logging output above.
npm ERR! System Darwin 13.3.0
npm ERR! command "node" "/usr/local/bin/npm" "start"
npm ERR! cwd /Users/ember/Dropbox/Code/bad-grizzly
npm ERR! node -v v0.10.28
npm ERR! npm -v 2.0.0-alpha-5
npm ERR! code ELIFECYCLE
npm ERR!
npm ERR! Additional logging details can be found in:
npm ERR!     /Users/ember/Dropbox/Code/bad-grizzly/npm-debug.log
npm ERR! not ok code 0
```

WHOA!! What happened? Oh, right, `app/index.js` doesn't actually exist yet.

We'll revisit the `scripts` object again when we write some tests.



## Enter the app/

```
$ mkdir app
$ touch app/index.js
```
    
Now, we _could_ copy/paste the Hello World example from [nodejs.org](http://nodejs.org):

```javascript
var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
```

But we ultimately want to do more than that, and in order to do more, we need some help. Let's call in reinforcements:

```
$ npm install --save express
```
 
This installs `express` and the `--save` option tells `npm` to add it to the `dependencies` object in our `package.json` file:

```
$ cat package.json
{
  "name": "bad-grizzly",
  "version": "0.0.0",
  ...,
  "dependencies": {
    "express": "^4.8.7"
  }
}
```

[Express](http://expressjs.com/) is "a minimal and flexible node.js web application framework [for building] web applications." It will handle lower-level stuff like the `createServer` boilerplate, so we can focus on our app. It also gives us an API with descriptive method names that will help us write readable, maintainable code.

Open `app/index.js` in your preferred editor and let the coding begin!

```javascript
var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('Greetings, earthlings!');
});

app.listen('3000');
console.log("The server is now listening on port 3000");
```

Save that, run `npm start` in your terminal, and open http://127.0.0.1:3000.

PROFIT!

#### Sidebar on stopping the server

I don't know _why_ you would ever want to stop our awesome app, but should you need to, just type `<control>-C` in your terminal.


## What have we done?!

Let's go through this line by line:

```javascript
var express = require('express');
```

---
 
We `required` Express. Duh. But what does that mean?


[Flesh this out]


http://docs.nodejitsu.com/articles/getting-started/what-is-require

    Node.js follows the CommonJS module system, and the builtin require function is the easiest way to include modules that exist in separate files. The basic functionality of requireis that it reads a javascript file, executes the file, and then proceeds to return the exports object. An example module:
    
    ```
    console.log("evaluating example.js");
    
    var invisible = function () {
      console.log("invisible");
    }
    
    exports.message = "hi";
    
    exports.say = function () {
      console.log(message);
    }
    ```
    
    So if you run var example = require('./example.js'), then example.js will get evaluated and then example be an object equal to:

    ```
    {
      message: "hi",
      say: [Function]
    }
    ```
---

Next, we created a new application with:

```javascript
var app = express();
```

This initialized a new Express application as `app`, which we take advantage of on the next few lines:

```javascript
app.get('/', function(req, res) {
  res.send('Greetings, earthlings!');
});
```

Here, we created a route and defined how we would respond to the route. We'll dig into this a little deeper shortly, let's finish looking at our app:

```javascript
app.listen('3000');
console.log("The server is now listening on port 3000");
```

`listen(port)` is where our app takes it's first breath, we pass in a port number for the server to listen on and that starts our app. After that, we log a message on the console, just to be friendly.


### app.VERB(path, [callback...], callback)

Express provides routing methods that mirror HTTP verbs, here we used the `GET` verb.

```javascript
app.get('/', function(req, res) {
  res.send('Greetings, earthlings!');
});
```

Other verbs like `POST` map to similar methods:

```javascript
app.post('/form', function(req, res) { ... });
```

The first argument to the method is the path we want to respond to, in this case '/'. The second argument is a callback function which will receive both the request object (`req`) and the response (`res`).

`req` contains attributes of the request—like query params:

```javascript
// GET /search?q=tobi+ferret
req.query.q
// => "tobi ferret"
```

`res` is the object our app will respond with. It includes methods to set the response code (`res.status(418)`), among other things. Here we used the `send()` method to respond with a simple string, "Greetings, earthlings!"

We'll turn this up to eleven soon.


### A minor refactor

Before we continue, there's one minor thing we should refactor. We've hardcoded the port number in two places:

```javascript
app.listen('3000');
console.log("The server is now listening on port 3000");
```

If we want to deploy this into the real world we need to be more flexible. How about this:

```javascript
app.port = process.env.PORT || 3000;

app.listen(app.port);
console.log("The server is now listening on port %s", app.port);
```

We'll use Node's global `process` object to look at the environment in which our app is running. If `PORT` has been set (perhaps with `PORT=1234 node app/index.js`) we should use that, otherwise, default to 3000. Additionally, we're adding the port number to a `port` attribute on our `app` object, so we can use it later if we need to.

Let's move on to the view.



## The View

We're developing for the web here, so we need to respond with HTML, not just a simple string. So this just isn't going to cut it anymore.

```javascript
app.get('/', function(req, res) {
    res.send('Greetings, earthlings!');
});
```

We want to write HTML, we just don't want to _write_ HTML. Enter Jade.

```
$ npm install --save jade
```

(There's that `--save` again.)

Jade is a "terse and simple templating language" for Node. With Jade we can write HTML without all the angle brackets and closing tags.

We can write this:

```jade
doctype html
html(lang="en")
  head
    title= pageTitle
  body
    h1 Jade - node template engine
    #container.col
      if youAreUsingJade
        p You are amazing
      else
        p Get on it!
      p.
        Jade is a terse and simple
        templating language with a
        strong focus on performance
        and powerful features.
```

And it will become:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Jade</title>
  </head>
  <body>
    <h1>Jade - node template engine</h1>
    <div id="container" class="col">
      <p>You are amazing</p>
      <p>
        Jade is a terse and simple
        templating language with a
        strong focus on performance
        and powerful features.
      </p>
    </div>
  </body>
</html>
```

Pretty cool.

We've already installed Jade, now we need to configure our app to use it. Add these lines to `app/index.js`, right after `var app = express();`:

```javascript
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
```
 
We're calling `set()` twice to set [configuration options](http://expressjs.com/4x/api.html#app-settings) that Express offers; `view engine` is set to `jade`, and the `views` path is set to `views` in the current directory.

`__dirname` is a Node global that contains the path of the directory that the currently executing script resides in. In this case `__dirname` is `app`.

`app/index.js` should look something like this now:

```javascript
var express = require('express');
var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
  res.send('Greetings, earthlings!');
});

// With the express server and routes defined, we can start to listen
// for requests. Heroku defines the port in an environment variable.
// Our app should use that if defined, otherwise 3000 is a pretty good default.
app.port = process.env.PORT || 3000;

app.listen(app.port);
console.log("The server is now listening on port %s", app.port);
```

Putting this in our code is all well and good, but nothing's going to work until we create our first view. Let's do that now:

```javascript
$ mkdir app/views
$ touch app/views/index.jade
```
 
Open `index.jade` in your text editor and paste in this code:

```jade
doctype html
html
  head
    meta(charset='utf-8')
    meta(http-equiv='X-UA-Compatible' content='IE=edge')
    title= pageTitle
    meta(name='viewport' content='width=device-width, initial-scale=1')
    link(rel='stylesheet' href='/css/app.css')
  body
    h1= 'Greetings, ' + user
```

I'm not going to go into much detail about the Jade syntax right now, beyond pointing out the `title` tag, where we are using Jade's inline buffered code output, `=`, to echo a JavaScript variable named `pageTitle`. `pageTitle` will be HTML escaped as it is output to the page. We do something similar with the `h1` tag, too.

Great! Now that we have a template, let's wire it up to our route. Back in `app/index.js`, update our call to `app.get()` with this:

```javascript
app.get('/', function(req, res) {
  res.render('index', {
    pageTitle: 'Hello, ' + process.env.USER,
    user: process.env.USER
  });
});
```
 
We've replaced our call to `res.send()` with `res.render()`.

### res.render(view, [locals], callback)

Express' `render()` method takes the name of the view to render as the first argument, and an object with local variables as the second. I'll leave researching the [third argument](http://expressjs.com/4x/api.html#res.render) as an exercise for the student.

Keys in the locals object are available as variables in the view, here we set up the `pageTitle` and `user` variables we use in `index.jade` and populate them with a value from your environment.

Run `npm start` in your terminal and open or refresh http://127.0.0.1:3000. You should see something like `Greetings, <your username>`



## Intro to Bower

When I started building websites 15 years ago, we didn't have great resources like Stack Overflow. If you needed a bit of code, you had to surf uphill—both ways—into very sketchy forums and sift through poorly written comments that quickly devolved into flame wars over whether Han shot first. We couldn't just clone an entire open-source project from GitHub; we had to write our shit from scratch, from line 1.

Today, you kids have things called "package managers" that allow you to use snippets, chunks, and even whole other projects; _you_ can release a project in an afternoon that consists of 90% or more third-party code. _We're living in the future!_

We've already used one package manager, `npm`, but `npm` is for the server, and web projects have a client-side. That's where [Bower](http://bower.io) comes in. Bower is best thing to come from Twitter, since... well, Twitter.

Bower lets you install packages from a variety of sources: the Bower registry, GitHub, a private Git server, even just a URL. Install CSS, JavaScript, Sass, images, you name it; if it goes on the front-end you can install it with Bower.

### Let's start nesting

Install Bower with:

```
$ npm install -g bower
```

The `-g` flag tells `npm` to install this package globally, meaning that instead of being placed in our app's `node_modules` directory, Bower will be installed somewhere under `/usr/local/` so the `bower` command is accessible from anywhere.

Using Bower can be as simple as:

```
$ bower install <package>
```

for a package in the Bower registry, or from a GitHub repo:

```
$ bower install jedfoster/shoestring
```

Or, perhaps a private Git repo:

```
$ bower install https://git.drft.io/jedfoster/shoestring.git
```

### Configuring Bower

By default Bower will install packages in a directory named `bower_components` at the root of your project (or wherever you happen to be at the time.)

That's cool, but I don't really like `bower_components` as a directory for my front-end stuff. Luckily, Bower gives us a way to customize the install directory, the `.bowerrc` file. `.bowerrc` is just JSON, so it should look pretty familiar by now. Don't let the leading dot scare you, that just hides the file from view in most circumstances, which is fine because we'll only be touching it once.

```
$ touch .bowerrc
```

Now, open that file in your editor and paste this in:

```json
{
  "directory": "./public/vendor"
}
```

There we are, now Bower packages will be installed in `public/vendor`.... What's that? `public/vendor` doesn't exist? `public/` doesn't even exist? No problem, Bower will create that path if it doesn't already exist.

But there's one more thing. Remember how we have `package.json` that keeps track of all our `npm` dependencies? Shouldn't we have something like that for Bower? We do, `bower.json`! `bower.json` will allow us to list our dependencies and then we just run `bower install` once, without specifying a package, and Bower will install everything we need.

```
$ touch bower.json
```

Open `bower.json` in your editor and paste this in:

```json
{
  "name": "app-name",
  "version": "1.0.0",
  "dependencies": {
    "shoestring-css": "latest"
  }
}
```

Interestingly, you use a `bower.json` file when you _create_ a Bower package—same way we've just done, but with a few more fields—so you've just created your first Bower package! It won't appear in the Bower registry, but technically, it's a Bower package that another project could include.

Let's do this!

```
$ bower install
```
    
You should now have `public/vendor/shoestring-css`. This is package is some generic, boilerplate CSS that I like to use on my projects. It won't win any design awards, but it gets the job done and it looks better than the browser defaults.


## A sidebar on package managers and Git

### or, "It's about what you can use, not what you own"

The main benefit of package managers, as far as I'm concerned, is that you can have _access_ to lots and lots of code, but it doesn't have to clutter your project. Remember what I said at the beginning, "Keeping your code organized makes your life easy." Part of "keeping your code organized" is _not_ organizing it, putting it somewhere where it can organize itself. That's what tools like `npm`, `bower`, Bundler, and `pip` do for you, they organize those external dependencies somewhere where you don't generally have to think about them.

In the Ruby world, where I live most of the time, we have Bundler. Bundler is awesome, and as far as I'm concerned, it's the gold standard for package managers. When you install a Ruby package (called a "gem"), it gets placed in a globally accessible directory, somewhere deep down in the OS. It's so deep it's hanging out with the Loch Ness Monster. But, once I declare it in my `Gemfile` (the Bundler equivalent of `package.json`) it's as accessible as `require "some-gem"`. Gems are baked into Ruby, so Bundler can run in just about any environment in which Ruby itself can run. Virtually zero thought.

Node and Bower are a bit different. They both maintain a cache of installed packages deep in the OS (to enable installation when you're offline), but in order to use a package in your project it has to be installed _inside_ the project, in `node_modules/` for `npm` or `bower_components` (or whatever you have specified in your `.bowerrc`) for Bower.

The challenge with that install model is, "This is part of my project, but is it _part_ of my project?", meaning, "Do I need to commit this with the rest of my code?" Committing a `node_modules` directory can add dozens or even hundreds of megabytes to a git repo.

Depending on your deployment environment and toolchain, sometimes committing everything makes the most sense. I've done this myself, just because it was easier than trying to get my production build chain to handle installation of dependencies at build time. But things are getting easier. It's a lot easier now to install Bower components on Heroku at build time than it was a year ago. So my advice now is to add `node_modules/` and `bower_components/` to your project's `.gitignore`.

If we have enough time at the end, we'll walk through deploying to and building on Heroku.


## Back to the front-end

We've installed and configured Bower, and we used it to install our first front-end dependency, `shoestring-css`. Now let's update our view to use it. Modify the `head` section of `app/views/index.jade` to look like this:

```jade
head
    meta(charset='utf-8')
    meta(http-equiv='X-UA-Compatible' content='IE=edge')
    title= pageTitle
    meta(name='viewport' content='width=device-width, initial-scale=1')
    link(rel='stylesheet' href='/vendor/shoestring-css/shoestring.css')
```

We're now linking to `/vendor/shoestring-css/shoestring.css` instead of `/css/app.css` which we had previously (and which doesn't exist).

```
$ npm start
```

Open/refresh http://127.0.0.1:3000.

Oh, noes!! There's still no CSS!! Inspecting the network tab in Chrome's Web Inspector shows that http://127.0.0.1:3000/vendor/shoestring-css/shoestring.css is coming back 404. What up with that?!

Easy, we haven't told our app that we want to serve static resources too. Open `app/index.js` and add this:

```javascript
app.use(express.static(__dirname + '/../public'));
```

right after `app.set('views', __dirname + '/views');`. Now, restart the app and refresh the page.

_Glorious Helvetica Neue!_


## The app

Let's take a moment to review the planned flow of our app:

1. A user enters Sass code into a text area
2. The client-side Ember app will post the input to server via AJAX
3. The server will process the input and respond with a JSON object containing the rendered CSS output
4. Ember will render the returned JSON in a template on our page
5. Profit

Let's continue coding on the server-side and knock out #3 before we turn our attention to the client-side.


## A brief intro to TDD

In test-driven development you write test code for your code before you actually write your code.

![](http://s3.drft.io/54121436.jpg)

If that sounds silly, I totally understand. Until about two years ago my tests consisted of, "Does it work when you load it in the browser?" My users found broken code for me, and users who find broken code are likely to not be users anymore. TDD helps you catch broken code _before_ it gets shipped; you can refactor and improve your logic without the fear of breaking anything, and if you do break something, you'll find out sooner.


## Red, green...

As we build our server-side functionality, we need to verify that it's doing what we need it to do, but we don't have a front-end yet. That's OK, we'll use some Node.js testing tools to interact with our API and inspect the output. Let's get started.

```
$ npm install --save-dev mocha
$ npm install --save-dev supertest
```

[Mocha](http://visionmedia.github.io/mocha/) is a test framework, and [SuperTest](https://github.com/visionmedia/supertest) is a library for testing HTTP. The `--save-dev` flags tell `npm` that these are "development dependencies". If we look at our `package.json`, we'll see that `npm` has created a new section, `devDependencies`, for us:

```javascript
"dependencies": {
    "express": "^4.8.7",
    "jade": "^1.6.0"
},
"devDependencies": {
    "mocha": "^1.21.4",
    "supertest": "^0.13.0"
}
```

Packages in `devDependencies` will not be loaded when our app is run in the production environment.

Next, lets create a file to contain our tests:

```
$ mkdir test
$ touch test/test.js
```

Before we open `test/test.js`, let's edit `package.json` so we can easily run our tests. In the `scripts` section, change the `test` item to this:

```json
"test": "./node_modules/mocha/bin/mocha"
```
Now when we run `npm test`, we'll be using the `mocha` script that was installed in our project earlier. By default, Mocha will run any `.js` file it finds in the `test` directory, so we don't need to any more configuration.

Open `test/test.js` in your editor and let's write a test.

```javascript
var assert = require("assert");

describe('When adding 1 and 1', function() {
  it('should return 2', function() {
    assert.equal((1 + 1), 2);
  });
});
```

Save that and run `npm test` in your terminal.

```
$ npm test

> bad-grizzly@0.0.0 test /Users/ember/Dropbox/Code/bad-grizzly
> ./node_modules/mocha/bin/mocha



  When adding 1 and 1
    ✓ should return 2


  1 passing (5ms)
```
Congratulations, you just wrote a passing test. We described a scenario, "When adding 1 and 1", stated an expectation, "It should return 2", and then asserted that two values are equal. `assert.equal()` takes two arguments and compares them, throwing an error if they are not equal. We can see this in action if we change line 3 to:

```javascript
assert.equal((1 + 1), 3);
```
 
and run `npm test` again.

```
  When adding 1 and 1
    1) should return 2


  0 passing (6ms)
  1 failing

  1) When adding 1 and 1 should return 2:
     AssertionError: 2 == 3
      at Context.<anonymous> (/Users/ember/Dropbox/Code/bad-grizzly/test/test.js:5:12)
      at callFn (/Users/ember/Dropbox/Code/bad-grizzly/node_modules/mocha/lib/runnable.js:249:21)
      at Test.Runnable.run (/Users/ember/Dropbox/Code/bad-grizzly/node_modules/mocha/lib/runnable.js:242:7)
      at Runner.runTest (/Users/ember/Dropbox/Code/bad-grizzly/node_modules/mocha/lib/runner.js:373:10)
      at /Users/ember/Dropbox/Code/bad-grizzly/node_modules/mocha/lib/runner.js:451:12
      at next (/Users/ember/Dropbox/Code/bad-grizzly/node_modules/mocha/lib/runner.js:298:14)
      at /Users/ember/Dropbox/Code/bad-grizzly/node_modules/mocha/lib/runner.js:308:7
      at next (/Users/ember/Dropbox/Code/bad-grizzly/node_modules/mocha/lib/runner.js:246:23)
      at Object._onImmediate (/Users/ember/Dropbox/Code/bad-grizzly/node_modules/mocha/lib/runner.js:275:5)
      at processImmediate [as _immediateCallback] (timers.js:336:15)



npm ERR! Test failed.  See above for more details.
npm ERR! not ok code 0
```

Whoops! That's what a failing test looks like.

(The `assert` module is included in Node, but we won't be using it for our tests.)

Now that we know what to look for, let's delete that code and start writing a real test against our app.

```javascript
var request = require('supertest');
var app = require('../app/index.js');

describe("POST /compile", function() {
  it("responds successfully", function(done) {
    request(app)
      .post('/compile')
      .expect(200, done);
  });
});
```

Note what's happening on line 2: we're including the main file of our app, `../app/index.js` (paths are relative to the current file). SuperTest will use `app` to actually launch our app and submit HTTP requests to it, just like we would if we loaded it in the browser.

Within the `it()` callback, notice that SuperTest (as the `request` variable) gives us a method named after the HTTP verb we need to use, just like Express. We pass the route we want to test as the argument to `post()` and then state an expectation of what should come back; a status of 200 "OK".

The `done` variable that we pass to the `it()` callback is itself a callback to Mocha to tell it when the test case is complete. You can read more about `done()` in the [Mocha documentation](http://visionmedia.github.io/mocha/#asynchronous-code).

Let's run our test.

```
$ npm test
```

Uh-oh:
    
```
The server is now listening on port 3000


  POST /compile
    1) responds successfully


  0 passing (4ms)
  1 failing

  1) POST /compile responds successfully:
     TypeError: Object #<Object> has no method 'address'
      at Test.serverAddress (/Users/ember/Dropbox/Code/bad-grizzly/node_modules/supertest/lib/test.js:57:18)
      at new Test (/Users/ember/Dropbox/Code/bad-grizzly/node_modules/supertest/lib/test.js:38:12)
      at Object.obj.(anonymous function) [as post] (/Users/ember/Dropbox/Code/bad-grizzly/node_modules/supertest/index.js:25:14)
      at Context.<anonymous> (/Users/ember/Dropbox/Code/bad-grizzly/test/test.js:10:8)
      at Test.Runnable.run (/Users/ember/Dropbox/Code/bad-grizzly/node_modules/mocha/lib/runnable.js:216:15)
      at Runner.runTest (/Users/ember/Dropbox/Code/bad-grizzly/node_modules/mocha/lib/runner.js:373:10)
      at /Users/ember/Dropbox/Code/bad-grizzly/node_modules/mocha/lib/runner.js:451:12
      at next (/Users/ember/Dropbox/Code/bad-grizzly/node_modules/mocha/lib/runner.js:298:14)
      at /Users/ember/Dropbox/Code/bad-grizzly/node_modules/mocha/lib/runner.js:308:7
      at next (/Users/ember/Dropbox/Code/bad-grizzly/node_modules/mocha/lib/runner.js:246:23)
      at Object._onImmediate (/Users/ember/Dropbox/Code/bad-grizzly/node_modules/mocha/lib/runner.js:275:5)
      at processImmediate [as _immediateCallback] (timers.js:336:15)



npm ERR! Test failed.  See above for more details.
npm ERR! not ok code 0
```

When I wrote my first test I ran into this, too. After some searching I discovered that this error is because the app is not yet a true module. Open `app/index.js` and edit line 2 to look like this:

```javascript
var app = module.exports = express();
```

Now the app is a proper module and can be included into other scripts, like our test.

```
$ npm test
```

```
POST /compile
  1) responds successfully


0 passing (18ms)
1 failing

1) POST /compile responds successfully:
  Error: expected 200 "OK", got 404 "Not Found"
```

Now we're getting somewhere. The server is responding 404 because that route doesn't exist yet. When practicing TDD, you want your tests to fail the first time, so you know that you have actually fixed the feature. This is the "red" part of "red, green, refactor".

Let's write the route. Open `app/index.js` and add this:

```javascript
app.post('/compile', function(req, res) {
  res.status(200).end();
});
```

Run `npm test` again and you should have a passing test. Yay!



## ...Refactor

We now have a basic test and route, but we need to test submission and processing of user input. Time to refactor. I'm going to move quickly through this next part as most of the mechanics are either already familiar or not particularly pertinent to the exercise.

Install the following:

```
$ npm install --save body-parser
$ npm install --save node-sass
```
 
Out of the box, Express can't actually parse the body of a request (e.g. a POST'ed form), so we need a middleware (modules that sit between either the request or the response and the app) to do that for us, `body-parser`. And we need to be able to compile Sass, so we need `node-sass`.

Next we need to update our `app/index.js`. Add these lines after `var app = ...`:

```javascript
var nodeSass = require('node-sass');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
```

That last line tells Express to use the `body-parser` middleware, and configure it to parse a JSON encoded request body.

Now, replace our old `app.post('/compile')` with this:

```javascript
app.post('/compile', function(req, res) {
  var stats = {};

  var css = nodeSass.render({
    data: req.body.compiler.sass + ' ',
    outputStyle: req.body.compiler.outputStyle,
    stats: stats,
    
    success: function(css) {
      res.json({
        compiler: {
          css: css,
          stats: stats
        }
      });
    },

    error: function(error) {
      res.status(500).send(error);
    }
  });
});
```

This is where we process our input and spit out compiled CSS. If the render is successful, we set the response to a JSON object containing the CSS and some statistics about the operation that `node-sass` is thoughtful enough to offer. If the render fails, we'll return 500 "Internal server error" and the error message.

(Note: I added ` + ' '` to `data` to help ensure that `render()` does not receive `null` for `data` would cause the server to abort and shut down. This is import for later on when we are working on the front end.)

At this point our test won't pass because we're not actually submitting any data. Let's fix that by updating our request to this:

```javascript
request(app)
  .post('/compile')
  .send({
    compiler: {
      sass: '$red: #f00;\n.test {\n  color: $red;\n}',
      outputStyle: 'compressed'
    }
  })
  .set('Content-Type', 'application/json')
  .expect(function(res) {
    if(res.body.compiler.css != '.test{color:#f00;}') throw new Error('expected ".test{color:#f00;}", got "' + res.body.compiler.css + '"');
  })
  .expect('Content-Type', /json/)
  .expect(200, done);
```
    
We're now `send()`ing a JSON object, just like we will from the browser and we're setting the request's content-type to JSON. We're also `expect()`ing that the response will be JSON, and that the body will contain a key, `css`, with a value of `.test{color:#f00;}`.

```
  POST /compile
    ✓ responds successfully (40ms)


  1 passing (43ms)
```

YAY!!

Here's a closer look at the JSON the server is returning:

```json
{
  "compiler": {
    "css": ".test{color:#f00;}",
    "stats": {
      "entry": "data",
      "start": 1410121632247,
      "includedFiles": [],
      "end": 1410121632248,
      "duration": 1
    }
  }
}
```

## One more refactor (because REST and JSON)

This isn't a traditional REST application where you would need to support CRUD concepts; we aren't building a blog app where you would have `posts` that could be created, read, updated, and deleted. We have a request object and a response object, neither of which—I would argue—benefit much from modeling. However, Ember has opinions.

I wanted to write this app in something approximating "The Ember Way". To do that, I wanted to use Ember Data, a module for managing model data, and its RESTAdapter, and in order to use those, I needed to wrap the request object in a model. Interestingly, when we `POST` our request to `/compile`, we'll actually be "creating" a record as far as Ember Data is concerned.

Out of the box, Ember Data is opinionated about how models should be serialized for transmission to and from the data store (in this case, our `/compile` route), and the HTTP verb used for that transmission.

When Ember Data packages up a model to create or update a record, it wraps the model's data in a node named after the model. For example, if we _were_ building a blog app, we might have a `Posts` model. Here's what the serialized version of that model would look like:

```json
{
  "posts": {
    "id": 12345,
    "title": "My new blog",
    "summary": "Lorem ipsum..."
    "body": "More lore ipsum..."
  }
}
```

I point this out because when I started writing this app, my request object looked like this:

```json
{
  "sass": "$red: #f00;\n.test {\n  color: $red;\n}",
  "outputStyle": "compressed"
}
```

Nice, simple, and to the point. Likewise, my response object looked like this:

```json
{
  "css": ".test{color:#f00;}",
  "stats": {
    ...
  }
}
```

But then Ember threw a monkey wrench and I had to refactor request and response to what we built earlier.

```json
// The Ember-compliant request
{
  "compiler": {
    "sass": "$red: #f00;\n.test {\n  color: $red;\n}",
    "outputStyle": "compressed"
  }
}

// The Ember-compliant response
{
  "compiler": {
    "css": ".test{color:#f00;}",
    "stats": {
      ...
    }
  }
}
```

So we've already accommodated that peccadillo, but we need to make one more concession to Ember Data. When it _creates_ a record, the RESTAdapter uses the POST verb, as is customary, but after the record has been created it will use the PUT verb, which is a behavior we have not accounted for yet.

Basically, we need to perform the same action with two different requests. This is an easy one; let's take a look at our `/compile` route:

```javascript
app.post('/compile', function(req, res) {
  var stats = {};

  var css = nodeSass.render({
    data: req.body.compiler.sass,
    outputStyle: req.body.compiler.outputStyle,
    stats: stats,
    
    success: function(css) {
      res.json({
        compiler: {
          css: css,
          stats: stats
        }
      });
    },

    error: function(error) {
      res.status(500).send(error);
    }
  });
});
```

We're performing our action within the body of the anonymous callback to `post()`. We can extract that functionality to another method that can then also be used as the callback for a call to `put()`.

```javascript
var compile = function(req, res) {
  var stats = {};

  var css = nodeSass.render({
    data: req.body.compiler.sass,
    outputStyle: req.body.compiler.outputStyle,
    stats: stats,

    success: function(css) {
      res.json({
        compiler: {
          css: css,
          stats: stats
        }
      });
    },

    error: function(error) {
      res.status(500).send(error);
    }
  });
};

app.post('/compile', compile);
app.put('/compile', compile);
```

Now our app will respond to both `POST /compile` and `PUT /compile` with our new `compile()` method as the callback. Easy peasy.

And with that, our server is complete. On to the client!

------

## Ember

At this point you can start your Node app in another terminal window and just leave it running; everything we do from here on will be client-side.

Let's install Ember and Ember Data in our app with Bower:

```
$ bower install ember#~1.7.0 --save
$ bower install ember-data#~1.0.0-beta.9 --save
```
 
This will install Ember and it's dependencies to `public/vendor`. And, just like `npm`, Bower offers a `--save` flag that will update `bower.json` for you. We won't use ember-data just yet, but we are going to need it later on.

**NOTE:** The `#~1.0.0-beta.9` is very important. Bower lets you specify a version for a package by adding a `#` followed by the desired version.

```
$ bower install <package>#<version>
```

In this case, with the `~`, we're specifying that we we'll accept any patch-level version that is _at least_ `1.0.0-beta.9`, but not greater than `1.0`. This is necessary because I spent a week troubleshooting issues with an outdated version of Ember Data I received when I ran just `bower install ember-data`. I want to save you that grief.


We'll need a file for our application-specific JavaScript, too:

```
$ mkdir public/js
$ touch public/js/app.js
```

Update `app/views/index.jade`:

```jade
doctype html
html
  head
    meta(charset='utf-8')
    meta(http-equiv='X-UA-Compatible' content='IE=edge')
    title= pageTitle
    meta(name='viewport' content='width=device-width, initial-scale=1')
    link(rel='stylesheet' href='/vendor/shoestring-css/shoestring.css')

  body

    script(src='/vendor/jquery/dist/jquery.min.js')
    script(src='/vendor/handlebars/handlebars.min.js')
    script(src='/vendor/ember/ember.js')
    script(src='/js/app.js')

```

We're including jQuery, Handlebars, Ember, and our own app.js, as well as removing the old h1 element. We're not including Ember Data yet, either.


Let's start writing some Ember. Open `js/app.js` and add this:

```javascript
var App = Ember.Application.create();
```

This creates a new instance of Ember.Application and makes it available as a variable named `App`. This is similar to when we created our Node app with

```javascript
var app = express();
```

Refresh the browser and... we get nothing. That's not surprising because our HTML is nothing but script tags at this point. Let's mock up our app.

```jade
.left
  h3 Input

  textarea(name='sass')

  select(name='outputStyle')
    option(value='nested') Nested
    option(value='compressed') Compressed

.right
  h3 Output

  pre
    code

  p
```

Nice. That gives us an idea of what our app will look like when it's done.


## Put some Handlebars on it

Let's make this a bit more dynamic:

```jade
script(type='text/x-handlebars')
  .left
    h3 Input

    {{textarea value=sass}}
    select(name='outputStyle')
      option(value='nested') Nested
      option(value='compressed') Compressed

  .right
    h3 Output

    pre
      code
        {{sass}}
    p
```

We wrapped our markup in a script tag, replaced the textarea with some Handlebars markup, and added new markup inside our `code` tag.

Note the type attribute in the script tag, `"text/x-handlebars"`. This tells Ember that this should be parsed with Handlebars. Handlebars is a templating library that allows you to write normal HTML and embed dynamic expressions with double braces; for example, we could write our original H1 greeting in Handlebars like this:

```html
<h1>Greetings, {{user}}</h1>
```
    
Ember will render the contents of this script tag to the page when it loads. Refresh and you should see our mockup.

Try typing something into our input field. Pretty cool, huh? With that simple markup we bound our input to another element on the page.

Congratulations, you just wrote your first Ember template.


## Core concepts in Ember

Before we continue building our app let's take a minute and talk about some core concepts in Ember.

Ember follows the Model-View-Controller pattern, MVC, similar to Rails and, to a lesser extent, Express.

The concepts you'll find throughout most Ember applications are:

* Routes (and the Router)
* Templates
* Models
* Controllers
* Views
* Components
* Helpers


### Routes and the Router

Routes are the URLs for the various states of the objects in your app. Ember places significant importance on the URL as a key feature and benefit of the web. A route links a model with its template.

The router is both a manifest of the routes in your app and the mechanism with which Ember updates the URL in the browser.

Technically, a route is optional, as we've already proven. Given a URL `/foo`, Ember will render template `foo` with an instance of model `Foo`. However, in practice, you'll probably want to define a route explicitly.


### Templates

Templates are the V in Ember's MVC. A template describes the UI for a model, and is written in Handlebars.

Templates update themselves as their model's data changes.


### Models

Models store the persistent state of objects in our app. Commonly, a model's data is retrieved from a database through a REST API.


### Controllers

In addition to having a model, a template can also have a controller. A controller acts an intermediary between the model and template, allowing you to manipulate data either before it is displayed or before it is stored.

For example, say you have a model:

```javascript
App.Person = DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string')
});
```

And a template:

```html
<h1>Greetings, {{firstName}} {{lastName}}</h1>
```

You could write a controller:

```javascript
App.PersonController = Ember.ObjectController.extend({
  fullName: function() {
    var person = this.get('person')
  
    return person.firstName + ' ' + person.lastName;
  }
});
```

Which would allow you to rewrite your template to:

```html
<h1>Greetings, {{fullName}}</h1>
```

Controllers are optional; if you don't create one, Ember will auto-generate one for you in memory.


### Views

Despite the name, views are _not_ the "view" in MVC. Ember considers it's Handlebars templates powerful enough to describe the majority of your app's UI. You will generally not need to create views—we won't in this app.

A view is primarily used for complex, custom event handling and creating reusable components. Ember includes a number of views for HTML elements such as form inputs and links.

You can use a view to translate browser events into application events; a `click` event becomes a `letsRoll` event which some part of your app can listen for.


### Components

A component is a standalone view. They enable you to build reusable elements and can help simplify your templates. We won't be creating any components for our app.


### Helpers

Handlebars allows you to "register" helper functions that modify data before it's displayed. Useful for date formatting for example.

Here's a look at how these pieces fit together:

![](http://s3.drft.io/ember-sketch.png)


## Naming conventions

Like Rails, Ember favors convention over configuration, and that is most apparent when it comes to naming things. Ember's naming conventions glue your app together without unnecessary boilerplate.

For example, if you have a URL `/users`, Ember will look for these objects:

* `App.UsersRoute`
* `App.UsersController`
* and a template `users`

(The route and controller are optional.)

If you try to go against Ember's naming conventions, you're going to have a bad time. Just let it happen.

![](http://s3.drft.io/e200835ce01879328afc6502158c79cb.jpg)

## Magic

These conventions set the stage for magic! We've already seen some of that magic happen with our simple template.

Ember gives you some things for free:

* `App.ApplicationRoute`
* `App.ApplicationController`
* the `application` template

Currently, our app is leveraging these conventions:

```jade
script(type='text/x-handlebars')
  .left
    h3 Input
```

Our template doesn't have a name, so Ember assumes it is the `application` template. And since we have not defined our own route or controller, Ember creates those for us.

Similarly, at each level of nesting, Ember provides `App.IndexRoute`, `App.IndexController`, and template `index` for free.


Ember has few other conventions that we'll explore later.


## Iterate

Now that we know about some of Ember's magic, let's go back to our app for another iteration.


We know now that we are using the default template `application`. Let's be more specific and instead use the `index` template in `index.jade`:

```jade
script(type='text/x-handlebars' id='index')
  .left
```

While we're at it, let's add an `App.IndexRoute` with a model to `app.js`:

```javascript
var App = Ember.Application.create();

App.IndexRoute = Ember.Route.extend({
  model: function () {
    return {
      sass: '$red: #f00;\n.test {\n  color: $red;\n}'
    };
  }
});
```

Cool, now we have a default value in our textarea.


It would be nice if our select menu wasn't hardcoded, though. Let's replace it with an instance of Ember.Select. Ember.Select is a built-in view for rendering `<select>` elements.

```jade
script(type='text/x-handlebars' id='index')
  .left
    h3 Input

    {{textarea value=sass}}
    
    {{view Ember.Select content=outputStyles value=selectedOutputStyle}}
```

It takes an array of values as `content` and a string as `value` for the initially selected value. We'll need to create a controller in order to set those up.

```javascript
App.IndexController = Ember.ObjectController.extend({
  outputStyles: ['nested', 'compressed'],

  selectedOutputStyle: 'nested'
});
```

Remember, a controller is a bridge between the model and the view, and can be used to decorate the model with additional data. Which is exactly what we've done.

This nice, with very little code we have dynamically built a select menu. But we'll need to write some more code in order for the app to actually _do_ anything interesting.


## Ember Data

As mentioned previously, we are going to use Ember Data to communicate with our server. Let's add that script file to `index.jade` now.

```jade
script(src='/vendor/jquery/dist/jquery.min.js')
script(src='/vendor/handlebars/handlebars.min.js')
script(src='/vendor/ember/ember.js')
script(src='/vendor/ember-data/ember-data.js')
script(src='/js/app.js')
```

We also need a more complete model in `app.js`:

```javascript
var App = Ember.Application.create();

App.Compiler = DS.Model.extend({
  sass: DS.attr('string'),
  outputStyle: DS.attr('string'),
  css: DS.attr('string'),
  stats: DS.attr()
});
```

We create a new object in our `App` namespace, `Compiler` (Ember is less opinionated about model names), which extends `DS.Model`, which is the namespace for Ember Data.

Something doesn't look quite right in our model... Let's review the objects that our server-side API is expecting:

```json
// The Ember-compliant request
{
  "compiler": {
    "sass": "$red: #f00;\n.test {\n  color: $red;\n}",
    "outputStyle": "compressed"
  }
}

// The Ember-compliant response
{
  "compiler": {
    "css": ".test{color:#f00;}",
    "stats": {
      ...
    }
  }
}
```

Our `App.Compiler` model contains attributes for both the request and response. Why?

Ember Data expects that if it hands the data store (the repository for model data) an object, that data store will respond with an object of the same kind, and vice versa. But we've already established that our app isn't quite a standard app. We made some concessions on the server side, and this is a concession we'll have to make on the client-side.

Since Ember expects both the request and response object have the same shape, we need to combine the two. We'll end up sending a few extra attributes in the request to the server, but our server-side logic can just ignore those. Likewise, our client-side logic for handling the response can ignore the `sass` and `outputStyle` values.

We also need to use this model in our route:

```javascript
App.IndexRoute = Ember.Route.extend({
  model: function () {
    return this.store.createRecord('compiler');
  }
});
```

Here, we are creating a new instance of our `Compiler` model. All of the taste, but none of the calories.


## Make the call

We haven't told Ember Data anything about our data store. By default, Ember Data will use its `RESTAdapter`. That's fine, but we will need to make some tweaks to the configuration, so we need to explicitly set the adapter that Ember Data will use.

```javascript
var App = Ember.Application.create();

App.ApplicationAdapter = DS.RESTAdapter.extend({
  buildURL: function(type, id, record) {
    return '/compile'
  }
});
```

Normally, the REST adapter would determine the URLs it communicates with based on the name of the model, but in our case the URL we need to hit doesn't follow the conventions. Fortunately, the REST adapter was designed to be much more flexible than other parts of Ember. By defining our own `buildURL` method we can force it to use the the path we've already built.

The default path for a given model is the plural form of the model name. For example, given a `Post` model, the REST adapter would make requests to `/posts`. Given our `Compiler` model, it would use `/compilers`.


## Action!

We still aren't actually communicating with the server. For that, we need to do a little more plumbing.

First, let's add a button to our form so that we can manually invoke the API call for debugging purposes.

```jade
  {{view Ember.Select content=outputStyles value=selectedOutputStyle}}

  <button {{action 'compile'}}> Go</button>

.right
```

Here we use the built-in helper `action` which fires an event, `compile` when the button is clicked. We'll need to listen for that event in our controller:

```javascript
App.IndexController = Ember.ObjectController.extend({
  outputStyles: ['nested', 'compressed'],

  selectedOutputStyle: 'nested',

  actions: {
    compile: function() {
      alert("Button clicked");
    }
  }
});
```

Refresh, paste `.test { color: red; }` into the into the input, and click "Go". Yay!

Now, let's actually POST input to the server:

```javascript
actions: {
  compile: function() {
    this.get('model').save()
      .then(function(response) {
        console.log('Success: ', response);
      });
  }
}
```

Refresh. Paste `.test { color: red; }`. Click. Now in our console, we should see something like:

![](http://s3.drft.io/Screen%20Shot%202014-09-27%20at%204.24.13%20PM.png)

Yay! Now update the right side of our page to display the CSS returned by the API:

```jade
pre
  code
    {{css}}
```

Notice that we didn't have to do anything more with the `compile` action to make `css` available in our template; `css` is a property of our model, and calling `save()` on the model automatically updated the values in the template.

Try it. Change `color: red;` in the input to `color: blue;`, click "Go", and see the output update.

But there's a problem: because the API doesn't return a value for `sass` the model updates itself with its default value, so as soon as we click "Go", our input is cleared. We need our input to not be so tightly linked to the model.

Change the textarea to:

```handlebars
{{textarea value=sassInput}}
```

and update `compile` to:

```javascript
compile: function() {
  this.set('sass', this.get('sassInput'));

  this.get('model').save()
    .then(function(response) {
      console.log('Success: ', response);
  });
}
```

Now, as we click "Go" our input remains.


## What's with `.get()`?

You may have noticed that in our template we access our model's properties directly by name (`{{sassInput}}`, `{{sass}}`, etc.) but in our controller we access those properties with `this.get('sassInput')` or `this.set('sass')`. Why?

Data binding is one of Ember's most powerful features. Binding is what allowed us to mirror our textarea with about three lines of code. Using the `get()` and `set()` methods allows observing objects to be notified when a property changes and update itself appropriately. While you _can_ access `sassInput` in the controller with `this.sassInput` __DON'T DO IT__!

Which leads us to...


## Observing the form

We can now send our input by clicking a button, but ain't nobody got time for that! Our input should send itself whenever it is changed. We do that by wrapping our `compile` action in an observer. Update the controller with:

```javascript
selectedOutputStyle: 'nested',

compileOnEntry: function() {
  this.send('compile');
}.observes('sassInput'),
```

Refresh. Paste `$red: blue; .test { color: $red; }`. Automatic updating FTW!


## A few minor tweaks

There are a few miscellaneous improvements left to be made.

First, we aren't actually sending a value for `outputStyle`. If you look at the request payload in the network panel you'll see that we're sending `null` for that property.

![](http://s3.drft.io/Screen%20Shot%202014-09-27%20at%205.25.45%20PM.png)

Easy fix:

```javascript
this.set('sass', this.get('sassInput'));
this.set('outputStyle', this.selectedOutputStyle);
```

Now:

![](http://s3.drft.io/Screen%20Shot%202014-09-27%20at%205.28.32%20PM.png)


Next, we should really observe `selectedOutputStyle` and recompile when that value changes:

```javascript
compileOnEntry: function() {
  this.send('compile');
}.observes('sassInput', 'selectedOutputStyle'),
```

If you've had your network panel open, you may have seen that Ember is making a request to `/compile` immediately after the page loads, before you've typed anything into the input.

![](http://s3.drft.io/Screen%20Shot%202014-09-27%20at%205.31.57%20PM.png)

We can fix this by wrapping our call to `save()` in a conditional that checks if `sassInput` is blank:

```javascript
if(! Ember.isBlank(this.get('sassInput'))) {
  this.get('model').save()
    .then(function(response) {
      console.log('Success: ', response);
    });
}
```

And lastly, we're only handling successful responses; we should really do something with unsuccessful responses.

`save()` returns a promise, and we're already using the "success" callback argument to `then()`, so all we have to do is add a "fail" callback:

```javascript
compile: function() {
  var self = this;

  this.set('sass', this.get('sassInput'));
  this.set('outputStyle', this.selectedOutputStyle);

  if(! Ember.isBlank(this.get('sassInput'))) {
    this.get('model').save()
      .then(function(response) {
        console.log('Success: ', response);
      },
      function(err) {
        console.log('Error: ', err);
        self.set('css', err.responseText);
      });
  }
}
```

We need to add `var self = this` in order to call `set()` within the error handler.



## One more thing

Up to this point we've been using the index route that Ember provides by convention. Let's define a route of our own now.

It  would be slick if we could view a previously saved snippet of Sass, just like on SassMeister.com. Let's add a route for `/gist`:

```javascript
var App = Ember.Application.create();

App.Router.map(function() {
  this.resource('gist', { path: '/gist' });
});
```

Remember, the router is a manifest of the URLs in your app. Here, we're adding a URL to that manifest.

Out of the box, Ember's router uses URL fragments, or hashes, to identify URLs—and thus, state—within an app. So, our app will now respond to a URL like `/#/gist/1`. When we change the hash, the browser fires a `hashchange` event, which tells the router to change the state of the app.

It would be nice not to have that hashmark in the URL, though. Ember makes that easy:

```javascript
App.Router.reopen({
  location: 'history'
});
```

Now the router will the browser's `history` API to manage URLs. This does require a minor tweak to our server, though. If we visit `/gist/1` right now, our server will return 404. Stop the server and modify the index route to this:

```javascript
var index = function(req, res) {
  res.render('index', {
    pageTitle: 'Hello, ' + process.env.USER,
    user: process.env.USER
  });
};

app.get('/', index);
app.get('/gist/*', index);
```

Just like we refactored the `/compile` route to respond to both POST and PUT, we refactor `/` so we can reuse the functionality for `/gist/1`.

Load `/gist/1` in your browser... and... nothing. Because we don't yet have a template for this route.

Update `index.jade`:

```jade
script(type='text/x-handlebars' id='gist')
  .left
    h3 Sass

  pre
    code
      {{sass}}

  .right
    h3 CSS

    pre
      code
        {{css}}

script(src='/vendor/jquery/dist/jquery.min.js')
```

Refresh. Still nothing? Because we don't have a model associated with this route. Let's refactor `App.Compiler`, replacing it with this:

```javascript
var schema = {
  sass: DS.attr('string'),
  css: DS.attr('string'),
  outputStyle: DS.attr('string'),
  stats: DS.attr()
};

App.Compiler = DS.Model.extend(schema);

App.Gist = DS.Model.extend(schema);
```

Refactoring your code in this manner is a crucial practice. Take every opportunity to break your code into reusable chunks. It keeps your codebase clean and maintainable.

Refresh. Still nothing. Let's have a look at the console.

![](http://s3.drft.io/Screen%20Shot%202014-09-28%20at%207.04.37%20AM.png)

The app is trying to load our model with a GET request to `/compile`, which doesn't work because that route only responds to POST and PUT.

Modify `App.ApplicationAdapter`:

```javascript
App.ApplicationAdapter = DS.RESTAdapter.extend({
  buildURL: function(type, id, record) {
    if(type == 'gist') return 'http://gist.drft.io/gists/' + id + '.json';

    return '/compile';
  }
});
```

Because our route is `/gist` Ember will try to load a `gist` model, so it passes `gist` as the `type` argument to `buildURL`. We can conditionally return a different URL for different types of models.

I created an Amazon S3 bucket that has a few JSON files that match the models we defined in our Ember app.

Refresh, and we now see our template populated with JSON loaded from a remote server. Whee!


Remember how Ember gives us an `application` template for free? Let's look a gift horse in the mouth and add our own `application` template.

```jade
body

  script(type='text/x-handlebars')
    nav
      {{#link-to 'index'}}Home{{/link-to}}
      {{#link-to 'gist' 1}}Gist 1{{/link-to}}
      {{#link-to 'gist' 2}}Gist 2{{/link-to}}
      {{#link-to 'gist' 3}}Gist 3{{/link-to}}

    {{outlet}}
```

`{{outlet}}` is a placeholder for other templates. The router will update the outlet with different templates as we move around in the app. If you've used Rails, it's just like calling `<%= yield %>` in a layout.

`{{#link-to}}` is a built-in Ember helper that builds links... to stuff. The first argument is the name of the route, and the second is the id for a corresponding model.

## Fin

Congratulations, you've just built a Node.js server with a REST API and an Ember front end. Along the way you used: the command line, npm, Node, bower, Express, LibSass, SCSS, HTTP verbs, ports, TDD, mocha, supertest, JSON, MVC, Jade, HTML, CSS, Ember, Ember Data, Handlebars, AJAX, URLs, and the history API. And all that in under 200 lines of code!

The highest of fives!

![](http://s3.drft.io/giphy.gif)

