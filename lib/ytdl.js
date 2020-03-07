var execFile = require('child_process').execFile;

var youtube_dl = __dirname + '/../bin/youtube-dl --verbose';
function execute(args, callback) {
  execFile(youtube_dl, args, function(error, stdout, stderr){
    console.error('>> process[', youtube_dl, args, ']');
    console.error('>> error  [', error, ']');
    console.error('>> stderr [', stderr, ']');
    console.error('>> stdout [', stdout, ']');
    callback(error, stderr, stdout);
  });
}

module.exports = {
  // Return the formats supported by youtube for video
  getFormats: function(url, callback) {
    execute([url, '-F'], function(error, stderr, result) {
      if(!!error) {
        if(stderr.search('HTTP Error 404') !== -1) return callback('Video not found!');
        return callback('Cound not find any download links!');
      }

      // Split the output into multiple lines
      var output = result.split('\n'),
        i = 0,
        len = output.length,
        parts = [],
        attrs = [],
        formats = [];

      // Find the start point at which the format list starts
      while(i < len && output[i].search('format code') === -1) i++;
      
      // Skip the heading
      i++;

      // Parse the formats to create an array of supported formats
      while(i < len) {
        // Skip the DASH videos
        if(output[i].search('DASH') === -1) {
          parts = output[i].trim().replace(/\s+/g, ' ').split(' ');

          // If there aren't enough parts, don't pick it as a format
          if(parts.length !== 1) {
            formats.push({
              format: parts[0],
              extension: parts[1],
              resolution: parts[2],
              note: parts[3]
            });
          }
        }
        i++;
      }

      return callback(null, formats);
    });
  },
  // Return the download link for the url and format
  getDownloadLink: function(url, format, callback) {
    execute([url, '-f', format, '--get-url'], function(error, stderr, result) {
      if(!!error) {
        if(stderr.search('HTTP Error 404') !== -1) return callback('Video not found!');
        if(stderr.search('requested format not available') !== -1) return callback('Requested format not available!');
        return callback('Cound not find any download links!');
      }
      
      callback(null, result);
    });
  }
};
