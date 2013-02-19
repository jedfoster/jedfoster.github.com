require 'yaml'

config_file = '_config.yml'
config = YAML.load_file(config_file)

env = ENV['env'] || 'github'

task :deploy do
  Rake::Task["build"].invoke
  
  if env == 'github'
    sh "git push origin master"
  
  else
    sh "rsync -avz #{config['destination']}/ #{config['environments'][env]['remote']['connection']}:#{config['environments'][env]['remote']['path']}"

    # # Run this first to backup the Git repos
    # rsync -acE --delete-after ~/git/ ~/Backups/git
    # 
    # # Then run this to send everything to Delta
    # rsync -e "ssh" -acE --delete-after ~/Backups/ jed@mini.local:/Volumes/Delta/Backups
  end
end

task :build do
  sh "jekyll --url"
end

task :launch do
  sh "open #{config['environments'][env]['url']}"
end