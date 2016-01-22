var fs = require("fs");
var TCITLocalApi = require('./../index.js');
var localapiController = new TCITLocalApi();

var buffer = fs.readFileSync('./../image/lena.jpg');
localapiController.imageBufferUpload(buffer).then(function(res) {
	console.log("-----------------------------------------------------------------");
    console.log("Test API imageBufferUpload Success");
    // console.log(res);
}).catch(function(error) {
	console.log("-----------------------------------------------------------------");
	console.log("Test API imageBufferUpload Error");
    console.log(error);
});


localapiController.imagePathUpload('./../image/lena.jpg').then(function(res) {
	console.log("-----------------------------------------------------------------");
	console.log("Test API imagePathUpload Success");
    // console.log(res);
}).catch(function(error) {
	console.log("-----------------------------------------------------------------");
	console.log("Test API imagePathUpload Error");
    console.log(error);
});

