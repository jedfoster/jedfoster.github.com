var src = './src',
    dest = './public';

module.exports = {
  harp: {
    src: __dirname + '/../public',
    dest: __dirname + '/../www',
    port: 9000
  },

  production: {
    dest: __dirname + '/../www',
    cdn: {
      headers: {
        'Cache-Control': 'max-age=315360000, no-transform, public'
      },
      router: {
        routes: {
          'code.html': 'code',
          'work.html': 'work',
          'notes.html': 'notes',
          'contact.html': 'contact',
          'portfolio2.html': 'portfolio2',
          'about/resume.html': 'about/resume',
          'space-narwhal/about-us.html': 'space-narwhal/about-us',
          'space-narwhal/commercial-products.html': 'code',
          'space-narwhal/contact-us.html': 'space-narwhal/contact-us',
          'space-narwhal/retail-products.html': 'space-narwhal/retail-products',
          'space-narwhal/shopping-cart.html': 'space-narwhal/shopping-cart',

          // Pass-through for anything that wasn't matched by routes above, to be uploaded with default options
          '^.+$': '$&'
        }
      }
    }
  }
}

