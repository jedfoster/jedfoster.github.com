require 'rubygems'
require 'bundler/setup'
require 'thor'

desc "Deploy the site"
task :deploy do
  Utilities.new.version_manifests

  sh 's3_website push'
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



desc 'Compile the app\'s icons to an SVG sprite'
task 'svg:sprite' do
  require 'nokogiri'

  Dir.mkdir 'public/img/svg' unless File.directory? 'public/img/svg'

  def build_sprite dir
    @doc = Nokogiri::XML::Document.new

    @svg = @doc.add_child Nokogiri::XML::Node.new 'svg', @doc

    @svg['xmlns'] = 'http://www.w3.org/2000/svg'
    # @svg['width'] = @svg['height'] = 120

    Dir.glob("#{dir}/*.svg").each do |file|
      node = Nokogiri::XML(File.open(file)).css('svg').first

      id = file.split('/').last.split('.').first

      symbol = Nokogiri::XML::Node.new 'symbol', @doc
      symbol['viewBox'] = node['viewBox'] if node['viewBox']
      symbol['id'] = id.downcase
      symbol << "<title>#{id}</title>" unless node.at 'title'
      symbol << node.children.to_xml.strip

      @svg.add_child symbol
    end

    File.open("public/img/#{dir}.svg", 'w') {|f| f.write(@doc.to_xml.gsub(/(\n|\t|\s{2,})/, '')) }
  end

  dirs = Dir.glob('svg/*').select {|f| File.directory? f}

  dirs.each do |dir|
    build_sprite dir
  end


end



def get_stdin(message)
  print message
  STDIN.gets.chomp
end



class Utilities < Thor
  include Thor::Actions

  no_tasks do
    def version_manifests
      Dir.glob("www/**/*.manifest", File::FNM_CASEFOLD).each do |file|
        gsub_file("#{file}", /# rev = ([\d]+)/, "# rev = #{Time.now.getutc.to_i}")
      end
    end
  end
end

