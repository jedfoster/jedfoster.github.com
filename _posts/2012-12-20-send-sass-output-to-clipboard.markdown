---
title: How to "send" Sass output to your clipboard
layout: post
description: In response to a question on the Sass Google Group I came up with this one-liner to send the compiled CSS to your clipboard.
categories: development
tags: sass command-line
permalink: /Send-sass-output-to-clipboard
---

In response to [this question][1] on the Sass Google Group I came up with this one-liner to send the compiled CSS to your clipboard.

`sass file.scss:file.css && cat file.css | pbcopy`

Not sure how useful this is, but there you go.


[1]: https://groups.google.com/forum/?fromgroups=#!topic/sass-lang/hCNISmfuFjI