var TCITLocalApi = require('./../index.js');

var params = {
    camera: {
        width: 640,
        height: 480,
        quality: 30,
        compress: true,
        send_image: false,
        vlc_params: ['-I', 'dummy', '--ignore-config', '--network-caching=1000']
    },
    face: {
        detection: {
            enable: true,
            tracking: false,
            max_size: 1024,
            min_size: 20,
            gender: true,
            age: true
        }
    },
    human: {
        detection: {
            enable: false,
            tracking: true,
            max_size: 640,
            min_size: 48
        }
    }
};


var localapiController = new TCITLocalApi();
var channels = [];
var logInfo = [];

localapiController.queryDeviceList().then(function(res) {
    var devices = res.devices;
    console.log(devices);
    var urls = [];
    devices.forEach(function(device) {
        urls.push(device.url);
    });
    localapiController.openMultiChannels(urls, params).then(function(res) {
        console.log(res.channel_ids);
        channels = res.channel_ids;
    });
}).catch(function(error) {
    console.log(error);
});


(function() {
    setTimeout(function() {

        //query channel list
        localapiController.queryChannelList().then(function(res) {
            var channelList = res.channels;
            channelList.forEach(function(channel){
                logInfo.push({
                    id: channel.channel_id,
                    counts: 0,
                    faces: 0
                });
            });  
        });

        //start listen data from websocket
        localapiController.listenWebSocketMsg(function(data) {
            logInfo.forEach(function(info){
                if( info.id == data.id ){
                    info.counts++;
                    if( data.data.faces.length > 0){
                        info.faces++;
                    }
                }
            });
        });

        trackLog();
    }, 10000);
}());



var trackLog = function(){
    setTimeout(function() {
        logInfo.forEach(function(info){
            console.log( info.id + " , counts = " + info.counts + ", faces = " + info.faces );
        });
        console.log( "--------------------------------------------------" );
        trackLog();
    }, 1000);
};



process.on('SIGINT', function() {
    localapiController.closeAllChannels().then(function(res) {
        process.exit();
    }).catch(function(error) {
        console.log(error);
        process.exit();
    });
});
