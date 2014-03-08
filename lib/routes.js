var ytdl = require('./ytdl');

module.exports = function(app) {

  // Index Page
  app.get('/', function(request, response) {
    response.render('index');
  });

};