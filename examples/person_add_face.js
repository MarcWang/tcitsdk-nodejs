var fs = require("fs");
var TCITLocalApi = require('./../index.js');

var localapiController = new TCITLocalApi();

var firstPersonImg = fs.readFileSync('./../image/lena.jpg');
var secondPersonImg = fs.readFileSync('./../image/ann.jpg');

var registPersonId = null;

function registPerson(callback) {
    localapiController.imageBufferUpload(firstPersonImg).then(function(res) {
        var imgId = res.img_id;
        return localapiController.faceDetect(imgId).then(function(res) {
            var faces = res.faces;
            var featureList = {
                features: []
            }
            if (faces.length > 0) {
                var face = faces[0];
                var buf = new Buffer(face.featureData, 'base64');
                // save buf to database, and read buf from Database
                var base64 = buf.toString('base64');

                featureList.features.push({
                    face_id: '1234AAA56',
                    featureData: base64
                });
            }

            var jsonStrFeatureList = JSON.stringify(featureList);
            return localapiController.createPerson(null, jsonStrFeatureList, null).then(function(res) {
                if (res.added_face_count > 0) {
                    registPersonId = res.person_id;
                    callback({
                        result: true
                    });
                }
            });
        });
    }).catch(function(error) {
        console.log(error);
        callback({
            result: false
        });
    });
}


function addFace() {
    localapiController.imageBufferUpload(secondPersonImg).then(function(res) {
        var imgId = res.img_id;
        localapiController.faceDetect(imgId).then(function(res) {
            var faces = res.faces;
            var featureList = {
                features: []
            }
            if (faces.length > 0) {
                var face = faces[0];
                featureList.features.push({
                    face_id: 'FACE_ID_TEMP',
                    featureData: face.featureData
                });

                var jsonStrFeatureList = JSON.stringify(featureList);
                return localapiController.addFaceToPerson(registPersonId, null, jsonStrFeatureList).then(function(res) {
                    console.log("-----------------------------------------------------------------");
                    console.log("Test API addFaceToPerson Success");
                    // console.log(res);
                });
            }
        });
    }).catch(function(error) {
        console.log(error);
    });
}


registPerson(function(res) {
    if (res.result) {
        addFace();
    }
})
