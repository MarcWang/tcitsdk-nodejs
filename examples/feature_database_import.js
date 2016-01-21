var fs = require("fs");
var Promise = require("bluebird");
var TCITLocalApi = require('./../index.js');

var localapiController = new TCITLocalApi();

var firstPersonImg = fs.readFileSync('./../image/lena.jpg');  
var secondPersonImg = fs.readFileSync('./../image/ann.jpg');  //regist from database
var thirdPersonImg = fs.readFileSync('./../image/patty.jpg'); //regist from database

var groupId = 'GROUP_ID_TEMP';

function readFile(file) {
    var data = fs.readFileSync(file);
    try {
        var obj = JSON.parse(data);
        return obj;
    } catch (err) {
        return null;
    }
}

function readJson(file) {
    return new Promise(function(resolve, reject) {
        var obj = readFile(file);
        (obj) ? resolve(obj): reject("not json format");
    });
}

function identifyPerson() {
    localapiController.imageBufferUpload(firstPersonImg).then(function(res) {
        var imgId = res;
        localapiController.faceDetect(imgId).then(function(res) {
            var faces = res;
            var jsonStrFeature = null;
            if (faces.length > 0) {
                var face = faces[0];
                jsonStrFeature = face.featureData;
                return localapiController.identify(groupId, null, jsonStrFeature).then(function(res) {
                    console.log(res);
                });
            }
        });
    }).catch(function(error) {
        console.log(error);
    });
}


function importDatabase(featureStr, callback) {
    localapiController.importFeatureStr(featureStr).then(function(res) {
        if (res) {
            callback({
                result: true
            });
        } else {
            callback({
                result: false
            });
        }
    }).catch(function(error) {
        callback({
            result: false
        });
    });
}

readJson('./featureDatabase.json').then(function(res) {
    var jsonStrFeatureDatabase = JSON.stringify(res);
    importDatabase(jsonStrFeatureDatabase, function(res){
        if( res.result ){
            identifyPerson();
        }
    });
}).catch(function(error) {
    console.log(error);
});


process.on('SIGINT', function() {
    process.exit();
});
