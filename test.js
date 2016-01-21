var TCITLocalApi = require('./index.js');
var fs = require("fs");

var localapiController = new TCITLocalApi();

if (!localapiController.setServerInfo('localhost', 8800)) {
    console.log("Set Server Information Error");
} else {
    console.log("Set Server Information Success"); 
}


var buffer = fs.readFileSync('./image/lena.jpg');
localapiController.imageBufferUpload(buffer).then(function(res) {
    var imgId = res;
    console.log("img_id = " + imgId);
}).catch(function(error) {
    console.log(error);
});

// localapiMgr.createFaceTrack().then(function(res) {
    //     var trackId = res;
    //     console.log("Create Track ID = " + trackId);
    //     localapiMgr.deleteFaceTrack(trackId).then(function(res) {
    //         console.log("Delete Track ID Success");
    //     }).catch(function(error) {
    //         console.log(error);
    //     });
    // }).catch(function(error) {
    //     console.log(error);
    // });


    // console.log("Create and Delete Person");
    // localapiMgr.createPerson().then(function(res) {
    //     console.log("Create Person ID = " + res.person_id);
    // }).catch(function(error) {
    //     console.log(error);
    // });

    // console.log("Query Channel List");
    // localapiMgr.queryChannelList().then(function(res) {
    // }).catch(function(error) {
    //     console.log(error);
    // });

    // console.log("Query Devices List");
    // localapiMgr.queryDeviceList().then(function(res) {
    //     console.log(res);
    // }).catch(function(error) {
    //     console.log(error);
    // });

process.on('SIGINT', function() {
    process.exit();
});
