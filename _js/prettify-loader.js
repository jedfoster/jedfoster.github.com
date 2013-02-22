(function($, window) {

  // Add pretty print to all pre and code tags.
  $('pre, code').addClass("prettyprint");

  // Remove prettify from code tags inside pre tags.
  $('pre code').removeClass("prettyprint");

  $('.highlight .prettyprint').addClass(function () {
    return 'lang-' + $('code', $(this)).attr('class');
  });

  // Activate pretty presentation.
  prettyPrint();
})(jQuery, this);