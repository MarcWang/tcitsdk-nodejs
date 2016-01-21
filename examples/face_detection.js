var fs = require("fs");
var TCITLocalApi = require('./../index.js');

var localapiController = new TCITLocalApi();
var bufferImg = fs.readFileSync('./../image/lena.min.jpg');


localapiController.imageBufferUpload(bufferImg).then(function(res) {
    var imgId = res;
    localapiController.faceDetect(imgId, null, null).then(function(res) {
        var faces = res;
        faces.forEach(function(face) {
            console.log(face);
        });
    });
}).catch(function(error) {
    console.log(error);
});


var base64Img = bufferImg.toString('base64');
localapiController.faceDetect(null, base64Img, null).then(function(res) {
    var faces = res;
    faces.forEach(function(face) {
        console.log(face);

    });
});


process.on('SIGINT', function() {
    process.exit();
});
