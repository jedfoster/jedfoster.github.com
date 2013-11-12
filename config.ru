# Static site using Rack (with expire headers and etag support)... great for hosting static sites on Heroku

require "bundler/setup"
require 'rack/contrib'
require 'rack-rewrite'
require './lib/rack/static_cache'

# Gzip responses
use Rack::Deflater

use Rack::StaticCache, :urls => [
    '/audio',
    '/css',
    '/fonts',
    '/img',
    '/js',
    '/favicon.ico',
    '/humans.txt',
    '/robots.txt',
    '/apple-touch-icon-72x72-precomposed.png',
    '/apple-touch-icon-114x114-precomposed.png',
    '/apple-touch-icon-precomposed.png',
    '/apple-touch-icon.png'
  ], :root => "_site", :duration => 7
use Rack::ETag

use Rack::Rewrite do
  rewrite '/', '/index.html'
  rewrite '/code', '/code.html'
  rewrite '/work', '/work.html'
  rewrite '/notes', '/notes.html'
  rewrite '/contact', '/contact.html'
  rewrite '/portfolio2', '/portfolio2.html'

  rewrite %r{/([\w_-]+).manifest}, '/$1.manifest'
  rewrite %r{/(\d{4}/\d{2})/([\w_-]+)}, '/$1/$2/index.html'
  rewrite %r{/blog/([\w_-]+)}, '/blog/$1/index.html'
  rewrite %r{/([\w_-]+)}, '/$1/index.html'
end

run Rack::Directory.new('_site')