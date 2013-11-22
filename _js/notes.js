var row = false,
    bodytxt = '';

$('table').each(function() {
  n = 0;
  l = $('th', this).length;
  x = '';

  while (n < l) {
    x += '<colgroup/>';
    n++;
  }

  $(this).prepend(x);
});




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

  console.log(location);

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