# TCIT LocalAPI NodeJS SDK
This repository provides NodeJS SDK for TCIT LocalAPI Service.

## Introduction

## NodeJS SDK Documentation

### `[API] getVersion()`

```javascript
var TCITLocalApi = require('tcitsdk-nodejs');
var localapiController = new TCITLocalApi();
var v = localapiController.getVersion();
```

### `[API] setServerInfo(host, port, wsPort)`

```javascript
var TCITLocalApi = require('tcitsdk-nodejs');
var localapiController = new TCITLocalApi();
localapiController.setServerInfo('localhost', "8800", "4662");
```

### `[API] imageBufferUpload(buffer)`

```javascript
var fs = require("fs");
var TCITLocalApi = require('tcitsdk-nodejs');
var localapiController = new TCITLocalApi();

var buffer = fs.readFileSync('./image/lena.jpg');
localapiController.imageBufferUpload(buffer).then(function(res) {
    console.log("Test API imageBufferUpload Success");
}).catch(function(error) {
    console.log("Test API imageBufferUpload Error");
});
```

### `[API] imagePathUpload(path)`

```javascript
var fs = require("fs");
var TCITLocalApi = require('tcitsdk-nodejs');
var localapiController = new TCITLocalApi();

localapiController.imagePathUpload('./image/lena.jpg').then(function(res) {
    console.log("Test API imagePathUpload Success");
}).catch(function(error) {
    console.log("Test API imagePathUpload Error");
});
```

### `[API] faceDetect(imgId, img, trackId)`

```javascript
var fs = require("fs");
var TCITLocalApi = require('tcitsdk-nodejs');
var localapiController = new TCITLocalApi();

var bufferImg = fs.readFileSync('./image/lena.jpg');
localapiController.imageBufferUpload(bufferImg).then(function(res) {
    var imgId = res.img_id;
    localapiController.faceDetect(imgId, null, null).then(function(res) {
        console.log("Test API faceDetect using img_id Success");
    });
}).catch(function(error) {
    console.log("Test API faceDetect using img_id Error");
});


var base64Img = bufferImg.toString('base64');
localapiController.faceDetect(null, base64Img, null).then(function(res) {
    console.log("Test API faceDetect using base64Img Success");
}).catch(function(error) {
    console.log("Test API faceDetect using base64Img Error");
});
```

### `[API] createFaceTrack()`
### `[API] deleteFaceTrack(trackId)`
### `[API] faceCompare(faceId1, faceId2)`
### `[API] createPerson(faceId, jsonStrFeatureList, groupId)`
### `[API] deletePerson(personId)`
### `[API] addFaceToPerson(personId, faceId, jsonStrFeatureList)`
### `[API] removeFaceFromPerson(personId, faceId)`
### `[API] getPersonInfo(personId)`
### `[API] queryPersonList()`
### `[API] personVerify(personId, faceId, jsonStrFeature)`
### `[API] imagePersonVerify(buffer, personId)`
### `[API] createGroup(personId)`
### `[API] deleteGroup(groupId)`
### `[API] addPersonToGroup(groupId, personId)`
### `[API] removePersonFromGroup(groupId, personId)`
### `[API] getGroupInfo(groupId)`
### `[API] queryGroupList()`
### `[API] groupIdentify(groupId, faceId, featureData)`
### `[API] humanDetect(imgId, img, trackId)`

```javascript

var fs = require("fs");
var TCITLocalApi = require('tcitsdk-nodejs');
var localapiController = new TCITLocalApi();

var bufferImg = fs.readFileSync('./image/people.jpg');
var base64Img = bufferImg.toString('base64');
localapiController.humanDetect(null, base64Img, null).then(function(res) {
    console.log("Test API humanDetect using base64Img Success");
}).catch(function(error) {
    console.log("Test API humanDetect using base64Img Error");
});

```

### `[API] createHumanTrack()`
### `[API] deleteHumanTrack(trackId)`
### `[API] openChannel(url, channelParam)`
### `[API] openMultiChannels(urls, channelParam)`
### `[API] closeChannel(channelId)`
### `[API] closeAllChannels()`
### `[API] getChannelInfo(channelId)`
### `[API] queryChannelList()`
### `[API] getDeviceInfo(url)`
### `[API] queryDeviceList()`
### `[API] listenWebSocketMsg(callback)`
### `[API] restartServer()`
### `[API] importFeatureStr(importStr)`
### `[API] importFeatureFile(importFile)`


## LocalAPI Documentation

[LocalAPI_Doc](https://tcit.gitbooks.io/localapi/content/api_doc.html)

## Architecture

## Require Module
- bluebird
- needle
- ws
- mocha (optional for test)
- chai (optional for test)
- fluent-ffmpeg (optional for test)


## How to install

**npm install**
```bat
$ npm install tcitsdk-nodejs
```

**build from github**
```bat
$ git clone https://github.com/MarcWang/tcitsdk-nodejs.git
$ npm install
```

## Example

