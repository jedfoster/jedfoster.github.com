require 'haml'

module Jekyll
  class HamlConverter < Converter
    safe true
 
    def matches(ext)
      ext =~ /haml/i
    end 
 
    def output_ext(ext)
      ".html"
    end
 
    def convert(content)
      engine = Haml::Engine.new(content)
      engine.render
    end
  end
end