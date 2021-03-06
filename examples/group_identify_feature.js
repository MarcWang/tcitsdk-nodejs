var fs = require("fs");
var TCITLocalApi = require('./../index.js');

var localapiController = new TCITLocalApi();

var firstPersonImg = fs.readFileSync('./../image/lena.jpg');
var secondPersonImg = fs.readFileSync('./../image/ann.jpg');
var thirdPersonImg = fs.readFileSync('./../image/patty.jpg');

var registPersonId = null;
var groupId = null;

function createGroup(callback) {
    localapiController.createGroup().then(function(res) {
        groupId = res.group_id;
        callback({
            result: true
        });
    }).catch(function(error) {
        console.log(error);
        callback({
            result: false
        });
    });
}


function registPerson(callback) {
    localapiController.imageBufferUpload(secondPersonImg).then(function(res) {
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
            return localapiController.createPerson(null, jsonStrFeatureList, groupId).then(function(res) {
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


function identifyPerson() {
    localapiController.imageBufferUpload(secondPersonImg).then(function(res) {
        var imgId = res.img_id;
        localapiController.faceDetect(imgId).then(function(res) {
            var faces = res.faces;

            var jsonStrFeature = null;
            if (faces.length > 0) {
                var face = faces[0];
                jsonStrFeature = face.featureData;
                var beginTime = new Date();
                return localapiController.groupIdentify(groupId, null, jsonStrFeature).then(function(res) {
                    console.log("-----------------------------------------------------------------");
                    console.log("Test API groupIdentify Success");
                    var endTime = new Date();
                    var diff = endTime.valueOf() - beginTime.valueOf();
                    console.log(beginTime);
                    console.log(endTime);
                    console.log(diff);
                    // console.log(res);
                });
            }
        });
    }).catch(function(error) {
        console.log(error);
    });
}

var count = 0;
var flag = true;

createGroup(function(res) {
    setInterval(function() {
        if (flag) {
            count++;
            console.log(count);
            if (count == 10000) {
                flag = false;
                identifyPerson();
            }
            registPerson(function(res) {
                if (res.result) {
                } else {
                    console.log("err");
                    localapiController.queryPersonList(res).then(function(res) {
                        console.log(res.persons.length);
                    })
                }
            })
        } else {
            return;
        }

    }, 100);
});
