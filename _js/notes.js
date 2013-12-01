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


var now = new Date();
var date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();


var momnt = moment();


var getThreshold = function(time, warn, miss, min, max) {
  var minThreshold =  moment().clone().subtract(min, 'minutes'), // before
      maxThreshold =  moment().clone().add(max, 'minutes'); // after

  var klass = '';

  if(time.isAfter(minThreshold) && time.isBefore(maxThreshold)) {
    if(moment().isBefore(time.clone().subtract(warn, 'minutes'))) {
      klass = 'good';
    }
  
    else if(moment().isBefore(time.clone().subtract(miss, 'minutes'))) {
      klass = 'warning';
    }

    else {
      klass = 'missed';
    } 
  }

  return klass;
};  


var updateThresholds = function() {
  console.log('called');
  $('time').each(function() {
    var $this = $(this);

    var klass = getThreshold( moment($this.attr('datetime')), $this.data('warn'), $this.data('miss'), $this.data('min'), $this.data('max')  );
    $(this).parent()[0].className = klass;
  });

  window.setTimeout(updateThresholds, 4000);
};


$('#morning td:nth-child(2)').each(function() {
  var time = moment(date + ' ' + $(this).text().trim() + ' AM', "YYYY-MM-DD HH:mm A"),
      warn = 25,
      miss = 17;
 
  var timeHTML = $('<time />')
                    .attr('datetime', time.format("YYYY-MM-DDTHH:mm"))
                    .data('warn', warn)
                    .data('miss', miss)
                    .data('min', 26)
                    .data('max', 45)
                    .html($(this).text().trim());
  $(this).html(timeHTML);
});


$('#evening td:first-child').each(function() {
  var time = moment(date + ' ' + $(this).text().trim() + ' PM', "YYYY-MM-DD HH:mm A"),
      warn = 10,
      miss = 4;

  console.log('"' + time.format() + '"');

  var timeHTML = $('<time />')
                    .attr('datetime', time.format("YYYY-MM-DDTHH:mm"))
                    .data('warn', warn)
                    .data('miss', miss)
                    .data('min', 20)
                    .data('max', 25)
                    .html($(this).text().trim());
  $(this).html(timeHTML);

   console.log(timeHTML);

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
