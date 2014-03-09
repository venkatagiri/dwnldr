var execFile = require('child_process').execFile;

var youtube_dl = __dirname + '/../bin/youtube-dl';
function execute(args, callback) {
  execFile(youtube_dl, args, function(error, stdout, stderr){
    callback(error, stdout);
  });
}

module.exports = {
  // Return the formats supported by youtube for video
  formats: function(url, callback) {
    execute([url, '-F'], function(error, stdout) {
      // Split the output into multiple lines
      var output = stdout.split('\n'),
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
  }
};
