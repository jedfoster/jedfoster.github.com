// When object is available, do function fn.
function when(obj, fn) {
  if (Object.isString(obj)) obj = /^[\w-]+$/.test(obj) ? $(obj) : $(document.body).down(obj);
  if (Object.isArray(obj) && !obj.length) return;
  if (obj) fn(obj);
}

function restripe(form_row, new_row) {
  if(!$(form_row).toggleClassName('zebra').hasClassName('zebra')) {
		$(new_row).toggleClassName('zebra');
	}
	return;
}

function clearRadioButtons(input_name) {
	var r = document.getElementsByName(input_name);
	for (var i = 0; i < r.length; i++) { r[i].checked = false; }
}

function toggleCheckboxes(input_name) {
	var r = document.getElementsByName(input_name);
	for (var i = 0; i < r.length; i++) {
		if(r[i].checked) { r[i].checked = false; }
		else { r[i].checked = true; }
	}
}


/* -- Jed's Accordion --  */
function accToggle(trigger, accordion) {
	var sticky = false;
	
	if(!accordion) {
	  accordion = trigger.element().next();
	}
	else {
		accordion = $(accordion);
	}
	
  accordion.adjacent('.collapsible_section').each(function(el){
    if(el.hasClassName('accRevealed') && $(el).visible()) {
      new Effect.SlideUp(el,{duration:0.4}); 
      el.removeClassName('accRevealed');
			if(el.hasClassName('accSticky')) {
				sticky = true;
			}
    }   
  });
  
	if(!accordion.visible()) {
	  new Effect.SlideDown(accordion,{duration:0.4});
	  accordion.addClassName('accRevealed');
  }
	else {
		if(!accordion.hasClassName('accSticky')) {
			new Effect.SlideUp(accordion,{duration:0.4}); 
	    accordion.removeClassName('accRevealed');
		}
	}
}



/* String.js ---------------------------------------------------------------*/
Object.extend(String.prototype, {
  upcase: function()
  {
    return this.toUpperCase();
  },

  downcase: function()
  {
    return this.toLowerCase();
  },
  
  toInteger: function()
  {
    return parseInt(this);
  },

  /* TODO - the replace commands here should still be optimized. */
  toSlug: function()
  {
    return this.strip().downcase()
        .replace(/[àâ]/g,"a").replace(/[éèêë]/g,"e").replace(/[îï]/g,"i")
        .replace(/[ô]/g,"o").replace(/[ùû]/g,"u").replace(/[ñ]/g,"n")
        .replace(/[äæ]/g,"ae").replace(/[öø]/g,"oe").replace(/[ü]/g,"ue")
        .replace(/[ß]/g,"ss").replace(/[å]/g,"aa")
        .replace(/[^-a-z0-9~\s\.:;+=_]/g, '').replace(/[\s\.:;=+]+/g, '-');
  }
});

// http://blog.airbladesoftware.com/2007/8/17/note-to-self-prevent-uploads-hanging-in-safari
/* Make uploads not hang in Safari. */
function closeKeepAlive() {
  if (/AppleWebKit|MSIE/.test(navigator.userAgent)) {
    new Ajax.Request("/ping/close", { asynchronous:false });
  }
}

function zebra(row) {
	if(!row.previous() || !row.previous().hasClassName('zebra')) {row.addClassName('zebra');}
}


var flashUp =  Effect;

function flash_notice(notice) {
	if(!notice) {
		notice = $('notice');
	}
	
	if(!notice.visible()) {
  	new Effect.SlideDown(notice, {duration: 0.2, queue: {position: 'end', scope: 'notice', limit: 2}});
		flashUp.SlideUp(notice, {delay: 5, duration: 0.5, queue: {position: 'end', scope: 'notice', limit: 2}});
	}
	
  else if(notice.visible()) {	
		var queue = flashUp.Queues.get('notice');
		var delay = 2.5 + ((queue.toArray().last().finishOn - new Date().getTime()) / 1000)
		
		queue.invoke('cancel');
		
		flashUp.SlideUp(notice, {delay: delay, duration: 0.5, queue: {position: 'end', scope: 'notice', limit: 1}});
	}
}

function update_notice (css_class, message) {
	var notice = new Element('div',{id: "notice", style:"display:none;"}).update('<div></div>');
	var p = new Element('p', {'class': css_class}).update(message);		

	if(!$('notice')) {				
		$('contentWrapper').insert({top: notice});
	}
	
	$('notice').firstDescendant().update(p);
	flash_notice($('notice'));
}


// rails.js
(function() {
  // Technique from Juriy Zaytsev
  // http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
  function isEventSupported(eventName) {
    var el = document.createElement('div');
    eventName = 'on' + eventName;
    var isSupported = (eventName in el);
    if (!isSupported) {
      el.setAttribute(eventName, 'return;');
      isSupported = typeof el[eventName] == 'function';
    }
    el = null;
    return isSupported;
  }

  function isForm(element) {
    return Object.isElement(element) && element.nodeName.toUpperCase() == 'FORM'
  }

  function isInput(element) {
    if (Object.isElement(element)) {
      var name = element.nodeName.toUpperCase()
      return name == 'INPUT' || name == 'SELECT' || name == 'TEXTAREA'
    }
    else return false
  }

  var submitBubbles = isEventSupported('submit'),
      changeBubbles = isEventSupported('change')

  if (!submitBubbles || !changeBubbles) {
    // augment the Event.Handler class to observe custom events when needed
    Event.Handler.prototype.initialize = Event.Handler.prototype.initialize.wrap(
      function(init, element, eventName, selector, callback) {
        init(element, eventName, selector, callback)
        // is the handler being attached to an element that doesn't support this event?
        if ( (!submitBubbles && this.eventName == 'submit' && !isForm(this.element)) ||
             (!changeBubbles && this.eventName == 'change' && !isInput(this.element)) ) {
          // "submit" => "emulated:submit"
          this.eventName = 'emulated:' + this.eventName
        }
      }
    )
  }

  if (!submitBubbles) {
    // discover forms on the page by observing focus events which always bubble
    document.on('focusin', 'form', function(focusEvent, form) {
      // special handler for the real "submit" event (one-time operation)
      if (!form.retrieve('emulated:submit')) {
        form.on('submit', function(submitEvent) {
          var emulated = form.fire('emulated:submit', submitEvent, true)
          // if custom event received preventDefault, cancel the real one too
          if (emulated.returnValue === false) submitEvent.preventDefault()
        })
        form.store('emulated:submit', true)
      }
    })
  }

  if (!changeBubbles) {
    // discover form inputs on the page
    document.on('focusin', 'input, select, texarea', function(focusEvent, input) {
      // special handler for real "change" events
      if (!input.retrieve('emulated:change')) {
        input.on('change', function(changeEvent) {
          input.fire('emulated:change', changeEvent, true)
        })
        input.store('emulated:change', true)
      }
    })
  }

  function handleRemote(element) {
    var method, url, params;

    var event = element.fire("ajax:before");
    if (event.stopped) return false;

    if (element.tagName.toLowerCase() === 'form') {
      method = element.readAttribute('method') || 'post';
      url    = element.readAttribute('action');
      params = element.serialize();
    } else {
      method = element.readAttribute('data-method') || 'get';
      url    = element.readAttribute('href');
      params = {};
    }

    new Ajax.Request(url, {
      method: method,
      parameters: params,
      evalScripts: true,

      onComplete:    function(request) { element.fire("ajax:complete", request); },
      onSuccess:     function(request) { element.fire("ajax:success",  request); },
      onFailure:     function(request) { element.fire("ajax:failure",  request); }
    });

    element.fire("ajax:after");
  }

  function handleMethod(element) {
    var method = element.readAttribute('data-method'),
        url = element.readAttribute('href'),
        csrf_param = $$('meta[name=csrf-param]')[0],
        csrf_token = $$('meta[name=csrf-token]')[0];

    var form = new Element('form', { method: "POST", action: url, style: "display: none;" });
    element.parentNode.insert(form);

    if (method !== 'post') {
      var field = new Element('input', { type: 'hidden', name: '_method', value: method });
      form.insert(field);
    }

    if (csrf_param) {
      var param = csrf_param.readAttribute('content'),
          token = csrf_token.readAttribute('content'),
          field = new Element('input', { type: 'hidden', name: param, value: token });
      form.insert(field);
    }

    form.submit();
  }


  document.on("click", "*[data-confirm]", function(event, element) {
    var message = element.readAttribute('data-confirm');
    if (!confirm(message)) event.stop();
  });

  document.on("click", "a[data-remote],a[data-remote=]", function(event, element) {
    if (event.stopped) return;
    handleRemote(element);
    event.stop();
  });

  document.on("click", "a[data-method]", function(event, element) {
    if (event.stopped) return;
    handleMethod(element);
    event.stop();
  });

  document.on("submit", function(event) {
    var element = event.findElement(),
        message = element.readAttribute('data-confirm');
    if (message && !confirm(message)) {
      event.stop();
      return false;
    }

    var inputs = element.select("input[type=submit][data-disable-with]");
    inputs.each(function(input) {
      input.disabled = true;
      input.writeAttribute('data-original-value', input.value);
      input.value = input.readAttribute('data-disable-with');
    });

    var element = event.findElement("form[data-remote],form[data-remote=]");
    if (element) {
      handleRemote(element);
      event.stop();
    }
  });

  document.on("ajax:after", "form", function(event, element) {
    var inputs = element.select("input[type=submit][disabled=true][data-disable-with]");
    inputs.each(function(input) {
      input.value = input.readAttribute('data-original-value');
      input.removeAttribute('data-original-value');
      input.disabled = false;
    });
  });
})();
// END rails.js

document.on('submit', 'form[enctype]', function(){closeKeepAlive();});

document.observe('dom:loaded', function() {
	when('notice', function(notice) {flash_notice(notice)});

	when($$('table.doZebra tbody tr'), function(e) {
		e.each(function(r) { zebra(r) });
	});
	
	when($$('.accItem'), function(e) {
		e.each(function(el) {
	    el.previous().addClassName('accTrigger').observe('click', accToggle.bindAsEventListener(this, el));
	    if(!el.hasClassName('accRevealed')) { el.hide(); } 
	  });
	});
	
	when($$("abbr,acronym,.help,.doToolTip"), function(e){
		e.each(function(el) { new Tooltip(el, {mouseFollow: false, appearDuration: .10,delay: 0, opacity: .95}); });
	});
});