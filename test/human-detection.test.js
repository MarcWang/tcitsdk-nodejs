var fs = require("fs");
var TCITLocalApi = require('./../index.js');

var localapiController = new TCITLocalApi();

var fileList = []
fs.readdirSync('./../image/human/').forEach(function(file) {
    fileList.push('./../image/human/' + file);
});
var idx = 0;
var length = fileList.length;


function humanDetection(path) {
    console.log(path)
    var bufferImg = fs.readFileSync(path);
    var base64Img = bufferImg.toString('base64');
    localapiController.humanDetect(null, base64Img, null).then(function(res) {
        console.log("-----------------------------------------------------------------");
        console.log("Test API humanDetect using base64Img Success");
        console.log(res);
        idx++;
        if( length > idx ){
            humanDetection(fileList[idx]);
        }

    }).catch(function(error) {
        console.log("-----------------------------------------------------------------");
        console.log("Test API humanDetect using base64Img Error");
        console.log(error);
        idx++;
        if( length > idx ){
            humanDetection(fileList[idx]);
        }
    });
}

if( length > idx ){
    humanDetection(fileList[idx])
}



