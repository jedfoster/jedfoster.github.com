---
title: Introducing Readmore.js
layout: post
description: My first foray into jQuery plugins.
categories: development
tags: JavaScript
permalink: /blog/readmore-js
---

This weekend was supposed to be a marathon coding session. 

I have a project that I let sit for too long. Sure, I've been cogitating on it for months, but I haven't made the progress on it that I should have. A week ago I woke up with the "hook"—that one little thing that gives you a foothold on a project—I needed. And with Christmas on a Tuesday, I'd have three full days of uninterrupted coding time. Just what I would need to ramp up and get momentum going into 2013.

## Rabbit holes. ##

This project is a new feature (several, actually) to an app I started many years ago. This time though, I'm using some new tools for the prototyping phase: [Sinatra][1], [Sass][2], and [Toadstool][3]. The latter is a style guide framework that I've been helping to develop. If you've ever developed Project A using Project B as a primary tool, while simultaneously developing Project B, you know how easy it can be to get lost in fixing and improving Project B when you should be focusing on Project A. That's been the last few months for me. Project B (aka Toadstool) has been getting most of my attention, at the expense of Project A.

Until a week ago, when I woke up "seeing" Project A in my mind. I saw almost everything—front-end, back-end, DB schemas, interaction details, and APIs. I felt like I had enough focus not to get distracted by issues with the tools at hand. I knew what needed to be done, and mostly how to do it.

## Timeline. (Or, how it all fell apart.) ##

### Saturday, 22 December ###

- **0500:** Wake up, make a pot of coffee, start coding.  
- **1300:** Heat some meatloaf in the microwave. Eat at my desk.  
- **1700:** Move to the couch, continue coding while watching season 2 of Sons of Anarchy on Netflix.  
- **2330:** Go to bed.

### Sunday, 23 December ###

- **0600:** Wake, make coffee, start coding.  
- **1150:** Need a "Read More/Less" function for the widget I'm building. Google "jquery text truncate".  
- **1230:** Looked at half a dozen projects, none are quite right. Several don't have working demos, even in the repo. Why?  
- **1231:** Find [jaketrent/jquery-readmore][4]. It's promising. Simple and smooth. I fork it and start tweaking.  
- **1340:** Can't figure out how to give this script a "Less" link—once the block is open there's no way to close it. Hungry. More meatloaf and a beer.  
- **1420:** I've now Googled for "jquery text shorten", "jquery read more read less", "jquery read more plugin", "jquery show more text", "jquery truncate read more", and "jquery read more slide". I've looked at more projects than I can count.   
- **1421:** Finally, find [jQuery Expander Plugin][5]. Looks good. Lots of config options. Should be easy to tweak to suit my needs.  
- **1450:** Why the heck does the block jump when `$.slideDown()` begins? The `fadeIn` option is a little better, but I really want the content to slide up and down.  
- **1505:** Seriously, WTF?!?! Is there no initial height parameter to the slide effects? Script.aculo.us had that years ago.  
- **1510:** Googled "jquery slidedown initial height". Apparently I'm not the the only one to notice this jumping issue.   
- **1511:** Found [Sliding content from a partial height with jQuery][6] This is good. Really, really good. Slides up and down smoothly, has a close link, has sensible markup.  
- **1515:** This script is what I've been looking for, but I want to encapsulate it and remove it's dependency on hardcoded classnames and pre-existing markup. I also want to make it configurable.  
- **1615:** Been trying to shoehorn this script into the plugin from [jaketrent/jquery-readmore][4]
- **1625:** After Googling "jquery extend plugin", find [Essential jQuery Plugin Patterns][7], but the link to the GitHub repo with the source code from the article is gone.  
- **1628:** Find [zenorocha/jquery-plugin-patterns][8]. AWESOME!!!
- **1930:** Been fighting with `this` (or is it `$this`, or `$.this`, or `$(this)`?) for hours when all of a sudden: IT WORKS!! I have a plugin with configuration options, no dependencies on specific classes or markup, and smooth animation! Time for dinner. And beer!
- **2045:** On the couch now, watching Netflix. No, it's still not quite right. More tweaks.
- **2230:** Wife makes me go to bed.


### Monday, 24 December ###

- **0400:** Been seeing JavaScript in my dreams. Get up, make coffee. More tweaks to this damn plugin.
- **0636:** Now it's good. Create a GitHub repo.
- **0715:** While writing the README, find additional tweaks.
- **0830:** Initial commit.
- **0900:** Of course it needs a nice project page.  
- **0930:** And a blog post to introduce it...


## And that, kids, is how I met your mother. ##

I don't want this to be a gripe session, but I believe that good software is often born of a need, a deficiency of process or even existing solutions, and I want to document the process I followed to fill this need. That the dozen other projects I examined weren't exactly what I needed says more about me than them. I mean no disrespect to the people behind those projects, especially those I have linked to, but my standards for this seemingly insignificant feature were, in the end, far more particular than even I had thought at the outset. I'll own that.

So, here's what all the fuss was about: [Readmore.js][10]

Here are a couple of links you may find interesting. I did.

- [How to get just numeric part of CSS property with jQuery?][11]
- [I am my code][12]


Now I _really_ need to get back to Project A.


[1]: http://www.sinatrarb.com/
[2]: http://sass-lang.com/
[3]: https://github.com/Toadstool-Stipe/toadstool
[4]: https://github.com/jaketrent/jquery-readmore
[5]: http://plugins.learningjquery.com/expander/
[6]: http://sim.plified.com/2008/09/15/sliding-content-from-a-partial-height-with-jquery/
[7]: http://coding.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/
[8]: https://github.com/zenorocha/jquery-plugin-patterns
[9]: https://help.github.com/articles/creating-project-pages-manually
[10]: http://jedfoster.github.com/Readmore.js/
[11]: http://stackoverflow.com/questions/1100503/how-to-get-just-numeric-part-of-css-property-with-jquery
[12]: http://devblog.avdi.org/2012/12/14/i-am-my-code/
