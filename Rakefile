require 'yaml'
require 'rubygems'
require 'bundler/setup'
require 'stringex'

config_file = '_config.yml'
config = YAML.load_file(config_file)

env = ENV['env'] || 'github'


desc "Build, then deploy the site; pass env={github|production}, default is github"
task :deploy do
  Rake::Task["build"].invoke
  
  if env == 'github'
    sh "git push origin master"

  elsif env == 's3'
    sh 's3_website push'
  
  else
    sh "rsync -avz #{config['destination']}/ #{config['environments'][env]['remote']['connection']}:#{config['environments'][env]['remote']['path']}"
  end
end


desc "Build the site; pass env={github|production|s3}, default is github"
task :build do
  sh "bundle exec jammit --force"
  sh "jekyll --url"
end


desc "Open the site in your default browser; pass env={github|production}, default is github"
task :launch do
  sh "open #{config['environments'][env]['url']}"
end





# usage rake new_post[my-new-post] or rake new_post['my new post'] or rake new_post (defaults to "new-post")
desc "Begin a new post in _posts"
task :post, :title do |t, args|
  title = get_stdin("Enter a title for your post: ")
  description = get_stdin("Enter a description for your post: ")
  categories = get_stdin("Enter categories for your post: ")
  tags = get_stdin("Enter tags for your post: ")
  
  mkdir_p "./_posts"
  permalink = "#{title.to_url}"
  filename = "./_posts/#{Time.now.strftime('%Y-%m-%d')}-#{permalink}.md"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  puts "Creating new post: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "title: \"#{title.gsub(/&/,'&amp;')}\""
    post.puts "layout: post"
    post.puts "description: \"#{description.gsub(/&/,'&amp;')}\""
    post.puts "categories: \"#{categories.gsub(/&/,'&amp;')}\""
    post.puts "tags: \"#{tags.gsub(/&/,'&amp;')}\""
    post.puts "permalink: /blog/#{permalink}"
    post.puts "date: #{Time.now.strftime('%Y-%m-%d %H:%M')}"
    post.puts "---"    
  end
end

def get_stdin(message)
  print message
  STDIN.gets.chomp
end
