var TCITLocalApi = require('./index.js');

var localapiMgr = new TCITLocalApi();

if (!localapiMgr.setServerInfo('localhost', 8800)) {
    console.log("Set Server Information Error");
} else {
    console.log("Create and Delete Face Track ID");
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
}


process.on('SIGINT', function() {
    process.exit();
});
