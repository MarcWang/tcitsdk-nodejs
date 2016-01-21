var fs = require("fs");
var TCITLocalApi = require('./../index.js');

var localapiController = new TCITLocalApi();


var buffer = fs.readFileSync('./../image/lena.jpg');
localapiController.imageBufferUpload(buffer).then(function(res) {
    var imgId = res;
    console.log("img_id = " + imgId);
}).catch(function(error) {
    console.log(error);
});


localapiController.imagePathUpload('./../image/lena.jpg').then(function(res) {
    var imgId = res;
    console.log("img_id = " + imgId);
}).catch(function(error) {
    console.log(error);
});


process.on('SIGINT', function() {
    process.exit();
});
