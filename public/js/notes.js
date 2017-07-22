function rgb2hex(rgb) {
  rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d\.]+))?\)$/);

  function hex(x) {
    return ('0' + parseInt(x).toString(16)).slice(-2);
  }

  return (hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])).toUpperCase();
}

function mix(color_1, color_2, weight) {
  function d2h(d) { return d.toString(16); }
  function h2d(h) { return parseInt(h, 16); }

  weight = (typeof(weight) !== 'undefined') ? weight : 50;

  var color = '#';

  for(var i=0; i <= 5; i+=2) {
    var v1 = h2d(color_1.substr(i, 2)),
        v2 = h2d(color_2.substr(i, 2)),
        val = d2h(Math.floor(v2 + (v1 - v2) * (weight/100.0) ));

    while(val.length < 2){
      val = '0' + val;
    }
    color += val;
  }

  return color;
}

function elementIndex(element) {
  return Array.prototype.indexOf.call(element.parentNode.children, element);
}

function getThreshold(time, warn, miss, min, max) {
  var minThreshold =  moment().clone().subtract(min, 'minutes'), // before
      maxThreshold =  moment().clone().add(max, 'minutes'); // after

  if(time.isAfter(minThreshold) && time.isBefore(maxThreshold)) {
    var scale_point = 100,
        diff = 0;

    var warnThreshold = time.clone().subtract(warn, 'minutes'),
        missThreshold = time.clone().subtract(miss, 'minutes');

    if(moment().isBefore(warnThreshold)) {
      diff = moment().diff(warnThreshold, 'minutes') * -1;

      if (diff < warn) {
        scale_point = (diff / warn) * 100;
      }

      return mix(rgb2hex(colors['good']), rgb2hex(colors['warning']), scale_point);
    }

    else if(moment().isBefore(missThreshold)) {
      diff = moment().diff(missThreshold, 'minutes') * -1;

      if (diff < warn) {
        scale_point = (diff / miss) * 100;
      }

      return mix(rgb2hex(colors['warning']), rgb2hex(colors['missed']), scale_point);
    }

    else {
      return colors['missed'];
    }
  }

  return '';
}

function updateThresholds() {
  // console.log('called');

  document.querySelectorAll('time').forEach(function(el) {
    var color = getThreshold( moment(el.getAttribute('datetime')), el.getAttribute('data-warn'), el.getAttribute('data-miss'), el.getAttribute('data-min'), el.getAttribute('data-max')  );

    el.parentElement.style.backgroundColor = color;
  });

  window.setTimeout(updateThresholds, 6000);
}


document.querySelectorAll('table').forEach(function(el) {
  i = 0;
  l = el.querySelectorAll('th').length;

  colgroups = '';

  while (i < l) {
    colgroups += '<colgroup/>';
    i++;
  }

  el.insertAdjacentHTML('afterbegin', colgroups);
});

var colors = {};

['missed', 'warning', 'good'].forEach(function(value) {
  var div = document.createElement('div');

  div.className = value;
  document.body.appendChild(div);

  colors[value] = window.getComputedStyle(div).backgroundColor;

  document.body.removeChild(div);
});

var now = new Date();
var date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

[
  {
    selector: '#morning td:nth-child(2)',
    meridian: 'AM',
    warn: 25,
    miss: 17,
    min: 35,
    max: 45
  },
  {
    selector: '#evening td:first-child',
    meridian: 'PM',
    warn: 10,
    miss: 4,
    min: 20,
    max: 25
  }
].forEach(function setTimeAttrs(config) {
  console.log(config, document.querySelectorAll(config.selector));
  document.querySelectorAll(config.selector).forEach(function(el) {
    var time = moment(date + ' ' + el.innerText.trim() + ' ' + config.meridian, 'YYYY-MM-DD HH:mm A');

    var timeHTML = document.createElement('time');
    timeHTML.setAttribute('datetime', time.format('YYYY-MM-DDTHH:mm'));
    timeHTML.setAttribute('data-warn', config.warn);
    timeHTML.setAttribute('data-miss', config.miss);
    timeHTML.setAttribute('data-min', config.min);
    timeHTML.setAttribute('data-max', config.max);

    timeHTML.innerHTML = el.innerText.trim();
    el.innerHTML = timeHTML.outerHTML;
  });
});

updateThresholds();

document.body.addEventListener('click', function(event) {
  if (event.target.nodeName.toLowerCase !== 'th' && !event.target.closest('th')) {
    return;
  }

  var element = event.target.closest('th');

  element.classList.toggle('selected');
});

document.body.addEventListener('click', function(event) {
  if (event.target.nodeName.toLowerCase !== 'td' && !event.target.closest('td')) {
    return;
  }

  var row, columns, bodytxt, city, location,
      element = event.target.closest('td'),
      indx = elementIndex(element),
      parentTable = event.target.closest('table');

  if(indx === 0) {
    row = element;
    columns = parentTable.querySelectorAll('th.selected');
  }
  else {
    row = element.parentElement.children[0];
    columns = [parentTable.querySelectorAll('th')[indx]];
  }

  bodytxt = 'On the ' + row.innerText.trim() + '. ';

  if(!columns || columns.length < 1) {
    columns = parentTable.querySelectorAll('th');
  }

  columns.forEach(function(el) {
    city = el.innerText.trim();

    if (city.match(/#497|Train/)) {
      return;
    }

    bodytxt += city + ' ' + row.parentElement.children[elementIndex(el)].innerText.trim() + '. ';
    el.classList.remove('selected');
  });

  location = 'sms://253.218.8202;body=' + (bodytxt); //.replace(/ /, '%20').replace(/:/, '%3A'));

  // console.log(location);

  window.location = location;
});
