I've been playing with Vim off and on for more than two years. Well, yesterday I decided that I need to take a more serious approach to learning it. 

I have set MacVim (`mvim`) as my shell editor and as my Git editor, replacing TextMate 2 (`mate`). 

    → echo $EDITOR
    mvim -f --nomru -c "au VimLeave Gemfile Gemfile.lock axle.rb public views !open -a Terminal"
  
    → git config --global core.editor
    mvim -f --nomru -c "au VimLeave * !open -a Terminal"
  
Now, when composing merge messages (I have a shell function that makes it easier to write commit messages from the command line, https://github.com/jedfoster/dotfiles/blob/master/bash/aliases#L62-L73) or interactively rebasing, I'll be using MacVim.

I have a [cheat sheet](https://gist.github.com/4269782) which I have printed and hung near my desk. I expect I will be looking at it a lot over the next few weeks.

These are the links I found most helpful as I was setting up MacVim:

* [MacVim and gvimrc by example
](http://sphericalcow.wordpress.com/2009/03/18/macvim-and-gvimrc-by-example/)
* [Railscasts TextMate theme for Vim](http://www.vim.org/scripts/script.php?script_id=1995)
* [scrooloose / nerdtree
](https://github.com/scrooloose/nerdtree)
* [tpope / vim-pathogen](https://github.com/tpope/vim-pathogen)
* [tpope / vim-fugitive](https://github.com/tpope/vim-fugitive)

Unfortunately, I haven't found a decent Vim port of the [TextMate theme](https://sites.google.com/a/grayskies.net/www/dawn_screencap.gif) I've been using since 2006. The Railscasts theme is completely different, but still feels right. We'll see how it does long-term.


These other resources have either been useful to me in the past as I've played with Vim or look like they will be useful in the future:

* [Smash Into Vim](https://peepcode.com/products/smash-into-vim-i) - screencast
* [Smash Into Vim II](https://peepcode.com/products/smash-into-vim-ii) - screencast
* [Everyone Who Tried to Convince Me to use Vim was Wrong](http://yehudakatz.com/2010/07/29/everyone-who-tried-to-convince-me-to-use-vim-was-wrong/)
* [MacVIM as TextMate replacement](http://zerokspot.com/weblog/2008/08/03/macvim-as-textmate-replacement/)
* [From TextMate to VIM for Rails Coders](http://zigzag.github.com/2010/02/14/from-textmate-to-vim-for-rails-coders.html)
* [Moving Your Mind Into Vim Mode](http://blog.wekeroad.com/thoughts/vim-is-your-daddy)


For at least the next month I'm going to treat MacVim mostly as I would a native text editor; I'm still going to use my mouse and I'll probably use most of the familiar OS shortcuts like `Command-S`, `Command-N` and `Command-O`. I'm not going to stress about learning all shortcuts and magic incantations; I'm focused on the basics: saving files, getting in an out of various modes, and rudimentary navigation. And I'm only going to use it as an adjunct to TextMate.

I expect that one day I'll wake up and realize that I've been using Vim for _all_ my text editing. But that probably won't be tomorrow.