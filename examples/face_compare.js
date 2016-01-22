var TCITLocalApi = require('./../index.js');
var Promise = require("bluebird");

var localapiController = new TCITLocalApi();
var faceDetector = function(path){
    return new Promise(function(resolve, reject) {
        localapiController.imagePathUpload(path).then(function(res) {
            var imgId = res.img_id;
            return localapiController.faceDetect(imgId);
        }).then(function(res){
            resolve(res.faces[0].face_id);
        }).catch(function(error) {
            reject(error);
        });
    });
}

Promise.all([
    faceDetector('./../image/ann.jpg'),
    faceDetector('./../image/lena.jpg')
]).then( function (value) {
    var face_ids = value;
    localapiController.faceCompare(face_ids[0], face_ids[1]).then(function(res) {
        console.log("-----------------------------------------------------------------");
        console.log("Test API faceCompare Success");
        // console.log(res);
    }).catch(function(error) {
        console.log("-----------------------------------------------------------------");
        console.log("Test API faceCompare Error");
        console.log(error);
    });
}).catch ( function (error) {
    console.log("-----------------------------------------------------------------");
    console.log("Test API faceCompare Error");
    console.error(error); 
});
