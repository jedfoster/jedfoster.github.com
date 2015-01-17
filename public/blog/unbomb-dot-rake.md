A quick and dirty Rake task to strip a BOM from a file.

```ruby
task :unbomb do
  file = ARGV.last
  
  string = File.open(file, 'r:utf-8').read().encode!('utf-8')
  
  File.open(file, 'w:utf-8') { |f| f.write string.sub!(/\uFEFF/, '') }
end
```

Invoke with `→ rake unbomb PATH/TO/FILE`


