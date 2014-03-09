var ytdl = require('./ytdl');

module.exports = function(app) {

  // Everything happens at the index page.
  app.get('/', function(request, response) {
    var url = request.query.url,
        format = request.query.format;

    response.locals.url = url || '';
    response.locals.formats = [];

    if(url && format) {
      // 3. Fetch the download link for this url & format and redirect to that link
      response.render('index');
    } else if(url) {
      // 2. Fetch the formats for the url and display them.
      ytdl.formats(url, function(error, formats) {
        response.locals.formats = formats;
        response.render('index');
      })
    } else {
      // 1. Show the index page
      response.render('index');
    }
  });

};