require 'yaml'

config_file = '_config.yml'
config = YAML.load_file(config_file)

env = ENV['env'] || 'github'

task :deploy do
  if env == 'github'
    sh "git push origin master"
  
  else
    sh "jekyll --url && rsync -avz #{config['destination']}/ #{config['environments'][env]['remote']['connection']}:#{config['environments'][env]['remote']['path']}"

    # # Run this first to backup the Git repos
    # rsync -acE --delete-after ~/git/ ~/Backups/git
    # 
    # # Then run this to send everything to Delta
    # rsync -e "ssh" -acE --delete-after ~/Backups/ jed@mini.local:/Volumes/Delta/Backups
  end
end

task :launch do
  sh "open #{config['environments'][env]['url']}"
end