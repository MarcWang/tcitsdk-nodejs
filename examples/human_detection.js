var fs = require("fs");
var TCITLocalApi = require('./../index.js');

var localapiController = new TCITLocalApi();

var bufferImg = fs.readFileSync('../image/patty.jpg');
var base64Img = bufferImg.toString('base64');
localapiController.humanDetect(null, base64Img, null).then(function(res) {
    console.log("-----------------------------------------------------------------");
    console.log("Test API humanDetect using base64Img Success");
    console.log(res);
}).catch(function(error) {
    console.log("-----------------------------------------------------------------");
    console.log("Test API humanDetect using base64Img Error");
    console.log(error);
});
