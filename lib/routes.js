var ytdl = require('./ytdl');

module.exports = function(app) {

  // Everything happens at the index page.
  app.get('/', function(request, response) {
    var url = request.query.url,
        format = request.query.format;

    response.locals.msg = '';
    response.locals.url = url || '';
    response.locals.formats = [];

    if(url && format) {
      // 3. Fetch the download link for this url & format and redirect to that link
      ytdl.getDownloadLink(url, format, function(error, link) {
        if(error) {
          response.locals.msg = error;
          response.render('index');
        } else {
          response.redirect(link);
        }
      });
    } else if(url) {
      // 2. Fetch the formats for the url and display them.
      ytdl.getFormats(url, function(error, formats) {
        if(error) {
          response.locals.msg = error;
        } else {
          response.locals.formats = formats;
        }
        response.render('index');
      })
    } else {
      // 1. Show the index page
      response.render('index');
    }
  });

};