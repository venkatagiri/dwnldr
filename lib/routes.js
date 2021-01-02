var ytdl = require('./ytdl'),
    download = require('request'),
    qs = require("querystring");

module.exports = function(app) {

  // Everything happens at the index page.
  app.get('/', function(request, response) {
    var url = request.query.url,
        format = request.query.format;

    response.locals.msg = '';
    response.locals.url = url || '';
    response.locals.formats = [];
    response.locals.qs = qs; // Used for encoding URI in the views.

    if(url && format) {
      // 3. Fetch the download link for this url & format and redirect to that link
      ytdl.getDownloadLink(url, format, function(error, link) {
        if(error) {
          response.locals.msg = error;
          response.render('index');
        } else {
          download(link).pipe(response);
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

  app.get('/:videoId.:format', function(request, response) {
    var videoId = request.params.videoId;
    var format = request.params.format;
    var formatNo = 'best[ext='+format+']/best';

    ytdl.getDownloadLink('https://www.youtube.com/watch?v='+videoId, formatNo, function(error, link) {
      if(error) {
        response.send(error);
      } else {
        download(link).pipe(response);
      }
    });
  });

};
