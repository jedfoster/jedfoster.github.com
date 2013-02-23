---
title: "unbomb.rake"
layout: post
description: "Strip a BOM from a file."
categories: ""
tags: ""
permalink: /blog/unbomb-dot-rake
date: 2013-02-22 16:01
---

A quick and dirty Rake task to strip a BOM from a file.

{% highlight ruby %}

task :unbomb do
  file = ARGV.last
  
  string = File.open(file, 'r:utf-8').read().encode!('utf-8')
  
  File.open(file, 'w:utf-8') { |f| f.write string.sub!(/\uFEFF/, '') }
end

{% endhighlight %}


Invoke with `→ rake unbomb PATH/TO/FILE`


