In response to [this question][1] on the Sass Google Group I came up with this one-liner to send the compiled CSS to your clipboard.

    sass file.scss:file.css && cat file.css | pbcopy

Not sure how useful this is, but there you go.


[1]: https://groups.google.com/forum/?fromgroups=#!topic/sass-lang/hCNISmfuFjI