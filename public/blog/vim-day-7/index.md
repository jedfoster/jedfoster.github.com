I have found myself using Vim for a lot more than I intended. Last week I thought I would only use it on those few occasions when I needed to jump to a text editor from the command line. One week in, I have changed the default application for XML, SQL, ERB, and ASP—don't ask [shudder]—file types to MacVim. I'll probably change shell scripts and Ruby files soon as well.

TextMate is still my primary editor, mainly because I frequently work with groups of files as a project. While NerdTree helps, the TextMate project model—especially with the [Project+][1] plugin—is _very_ comfortable. And when it comes to the tools we use comfort is a huge factor, arguably even bigger than efficiency. A comfortable coder is usually more efficient than an uncomfortable one. 

The main hurdle for me with projects in Vim is the concept of buffers, windows, and tabs, which differs from the TextMate model of `tab == file` and `window == collection of tabs`. I'm still trying to wrap my head around it all, but these links had some helpful information:

* [Buffers, windows, and tabs][2]
* [Using Vim's tabs like buffers][3]

I'm also still struggling with all the different keyboard commands; I have to build up all new muscle-memory. And many of Vim's commands aren't chords (Command-Shift-S), but phrases (:w) where each character is typed. It's a different model and takes some getting used to.

A few TextMate niceties I miss in Vim are automatic tag completion and in-app web preview. I understand that Vim can have similar functionality through a dizzying array of plugins, but I haven't had time to play with any. A couple of plugins that I plan on investigating this week are:

* [snipMate : TextMate-style snippets for Vim][4]
* [carlhuda/janus][5]

A few more miscellaneous links I found of interest this week:

* ["Unix as IDE: Editing"][6], shows how Vim can work with the larger toolbox of the *nix shell, and I saved it to Instapaper for later review.
* [Vimcasts.org][7]
* [Practical Vim: Edit Text at the Speed of Thought][8] I had actually forgotten that I bought this book from Pragmatic several months ago, until I saw a link to it in the sidebar of the Vimcasts home page. It is now at the top of my technical reading list.


[1]: http://ciaranwal.sh/2008/08/05/textmate-plug-in-projectplus
[2]: http://blog.sanctum.geek.nz/buffers-windows-tabs/
[3]: http://stackoverflow.com/questions/102384/using-vims-tabs-like-buffers
[4]: http://www.vim.org/scripts/script.php?script_id=2540
[5]: https://github.com/carlhuda/janus
[6]: http://blog.sanctum.geek.nz/unix-as-ide-editing/
[7]: http://vimcasts.org
[8]: http://pragprog.com/book/dnvim/practical-vim