$('table').each(function() {
  i = 0;
  l = $('th', this).length;
  colgroups = '';

  while (i < l) {
    colgroups += '<colgroup/>';
    i++;
  }

  $(this).prepend(colgroups);
});

var colors = {
  missed: '',
  warning: '',
  good: ''
};

$(['missed', 'warning', 'good']).each(function(k, value) {
  var div = document.createElement('div');

  div.className = value;
  document.getElementsByTagName("body")[0].appendChild(div);

  colors[value] = window.getComputedStyle(div).backgroundColor; 

  document.getElementsByTagName("body")[0].removeChild(div);
});

var rgb2hex = function(rgb) {
  rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d\.]+))?\)$/);
  function hex(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }
  return (hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])).toUpperCase();
};

var mix = function(color_1, color_2, weight) {
  function d2h(d) { return d.toString(16); }
  function h2d(h) { return parseInt(h, 16); }

  weight = (typeof(weight) !== 'undefined') ? weight : 50;

  var color = "#";

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
};

var now = new Date();
var date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

//var momnt = moment(date + ' 3:47 PM', "YYYY-MM-DD HH:mm A");


var getThreshold = function(time, warn, miss, min, max) {
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
      return colors['missed']      
    }
  }
  
  return '';
};  

var updateThresholds = function() {
  //console.log('called');

  $('time').each(function() {
    var $this = $(this);

    var color = getThreshold( moment($this.attr('datetime')), $this.data('warn'), $this.data('miss'), $this.data('min'), $this.data('max')  );
    $($(this).parent()[0]).css('backgroundColor', color);
  });

  window.setTimeout(updateThresholds, 6000);
};


$('#morning td:nth-child(2)').each(function() {
  var time = moment(date + ' ' + $(this).text().trim() + ' AM', "YYYY-MM-DD HH:mm A"),
      warn = 25,
      miss = 17;
 
  var timeHTML = $('<time />')
                    .attr('datetime', time.format("YYYY-MM-DDTHH:mm"))
                    .data('warn', warn)
                    .data('miss', miss)
                    .data('min', 35)
                    .data('max', 45)
                    .html($(this).text().trim());
  $(this).html(timeHTML);
});


$('#evening td:first-child').each(function() {
  var time = moment(date + ' ' + $(this).text().trim() + ' PM', "YYYY-MM-DD HH:mm A"),
      warn = 10,
      miss = 4;

  var timeHTML = $('<time />')
                    .attr('datetime', time.format("YYYY-MM-DDTHH:mm"))
                    .data('warn', warn)
                    .data('miss', miss)
                    .data('min', 20)
                    .data('max', 25)
                    .html($(this).text().trim());
  $(this).html(timeHTML);
});


updateThresholds();


$('th').on('click', function(event) {
  $(this).toggleClass('selected');
});


$('td').on('click', function(event) {
  var parentTable = $(this).parents('table');

  if($(this).index() == 0) {
    var row = $(this);
    var columns = $('th.selected', parentTable);
  }
  else {
    var row = $($(this).parent().children()[0]);
    var columns = $($('th', parentTable)[$(this).index()]);
  }

  bodytxt = 'On the ' + row.text().trim() + '. ';

  if(columns.length < 1) {
    columns = $('th', parentTable);
  }

  $(columns).each(function(key) {
    city = $(this).text().trim();

    if (city.match(/#497|Train/) || $(this).index() == 0) {
      return;
    }

    bodytxt += city + ' ' + $(row.parent().children()[$(this).index()]).text().trim() + '. ';
  });

  columns.removeClass('selected');

  var location = 'sms://253.218.8202;body=' + (bodytxt); //.replace(/ /, '%20').replace(/:/, '%3A'));

  // console.log(location);

  window.location = location;
});


$("table").delegate('td', 'mouseover mouseleave touchenter touchleave', function(e) {
  if (e.type == 'mouseover' || e.type == 'touchenter') {
    $(this).parent().addClass("hover");

    if($(this).index() > 0) {
      $(this).parents('table').children("colgroup").eq($(this).index()).addClass("hover");
    }
  }
  else {
    $(this).parent().removeClass("hover");

    if($(this).index() > 0) {
      $(this).parents('table').children("colgroup").eq($(this).index()).removeClass("hover");
    }
  }
});


$("table").delegate('th', 'mouseover mouseleave touchenter touchleave', function(e) {
  if (e.type == 'mouseover' || e.type == 'touchenter') {
    $(this).parents('table').children("colgroup").eq($(this).index()).addClass("hover");
  }
  else {
    $(this).parents('table').children("colgroup").eq($(this).index()).removeClass("hover");
  }
});
