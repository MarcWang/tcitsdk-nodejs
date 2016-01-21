var fs = require("fs");
var TCITLocalApi = require('./../index.js');

var localapiController = new TCITLocalApi();

var firstPersonImg = fs.readFileSync('./../image/lena.jpg');
var secondPersonImg = fs.readFileSync('./../image/ann.jpg');

var registPersonId = null;

function registPerson(callback) {
    localapiController.imageBufferUpload(firstPersonImg).then(function(res) {
        var imgId = res;
        return localapiController.faceDetect(imgId).then(function(res) {
            var faces = res;
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


function verifyFace() {
    localapiController.imageBufferUpload(secondPersonImg).then(function(res) {
        var imgId = res;
        localapiController.faceDetect(imgId).then(function(res) {
            var faces = res;
            var jsonStrFeature = null;
            if (faces.length > 0) {
                var face = faces[0];
                jsonStrFeature = face.featureData;

                console.log(jsonStrFeature);
                return localapiController.verify(registPersonId, null, jsonStrFeature).then(function(res) {
                    console.log(res);
                });
            }
        });
    }).catch(function(error) {
        console.log(error);
    });
}


registPerson(function(res) {
    console.log(res);
    if (res.result) {
        verifyFace();
    }
})


process.on('SIGINT', function() {
    process.exit();
});
