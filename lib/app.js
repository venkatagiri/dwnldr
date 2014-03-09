var express = require('express'),
  app = express(),
  config = require('./config'),
  routes = require('./routes');

// Configurations
app.configure(function() {
  // Use X-Forwarded-For as req and res ips.
  app.enable('trust proxy');

  // Logger.
  app.use(function(request, response, next) {
    console.log('[%s] [%s] %s %s', Date(), request.ip, request.method, request.url);
    next();
  });

  // Use EJS.
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/../views');

  // Serve static content from public.
  app.use(express.static(__dirname + '/../public'));

  // Parses POST requests as parameters.
  app.use(express.json());
  app.use(express.urlencoded());
  
  // Enable sessions.
  app.use(express.cookieParser('shhhh, very secret'));

  // Load the routes
  routes(app);
});

// Wrapper to start the server.
app.start = function() {
  this.listen(config.port, function() {
    console.log('Listening on port', config.port);
  });
};

module.exports = app;
