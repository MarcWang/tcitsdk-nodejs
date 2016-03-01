var ffmpeg = require('fluent-ffmpeg');

// ffmpeg('./123.avi')
//   .on('filenames', function(filenames) {
//     console.log('Will generate ' + filenames.join(', '))
//   })
//   .on('end', function() {
//     console.log('Screenshots taken');
//   })
//   .screenshots({
//     // Will take screens at 20%, 40%, 60% and 80% of the video
//     count: 20,
//     filename: 'thumbnail-%s.jpg',
//     folder: './video/',
//     size: '320x240'
//   });