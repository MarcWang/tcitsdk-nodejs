var fs = require("fs");
var TCITLocalApi = require('./../index.js');

var localapiController = new TCITLocalApi();
var bufferImg = fs.readFileSync('./../image/lena.min.jpg');

localapiController.imageBufferUpload(bufferImg).then(function(res) {
    var imgId = res.img_id;
    localapiController.faceDetect(imgId, null, null).then(function(res) {
        console.log("-----------------------------------------------------------------");
        console.log("Test API faceDetect using img_id Success");
        // console.log(res);
    });
}).catch(function(error) {
    console.log("-----------------------------------------------------------------");
    console.log("Test API faceDetect using img_id Error");
    console.log(error);
});


var base64Img = bufferImg.toString('base64');
localapiController.faceDetect(null, base64Img, null).then(function(res) {
    console.log("-----------------------------------------------------------------");
    console.log("Test API faceDetect using base64Img Success");
    // console.log(res);
}).catch(function(error) {
    console.log("-----------------------------------------------------------------");
    console.log("Test API faceDetect using base64Img Error");
    console.log(error);
});
