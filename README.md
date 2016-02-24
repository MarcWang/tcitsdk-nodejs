
![logo](https://github.com/MarcWang/tcitsdk-nodejs/blob/master/tcit_logo.png)

# TCIT LocalAPI NodeJS SDK
This repository provides NodeJS SDK for how to connect TCIT LocalAPI Service.

## Introduction

TCIT LocalAPI is computer vision local service, most features include face detection, facial recognition, age and gender estimation...

## LocalAPI Documentation

[LocalAPI_Doc](https://tcit.gitbooks.io/localapi/content/api_doc.html)

## Architecture

![architecture](https://github.com/MarcWang/tcitsdk-nodejs/blob/master/architecture.png)

## Require Module
- bluebird
- needle
- ws
- mocha (optional for test)
- chai (optional for test)
- fluent-ffmpeg (optional for test)

## Quick Start

**npm install**
```bat
$ npm install tcitsdk-nodejs
```

**build from github**
```bat
$ git clone https://github.com/MarcWang/tcitsdk-nodejs.git
$ npm install
```

## Platform Support
- Window 
- Linux 

## NodeJS SDK Documentation

### `[API] getVersion()`

Get SDK version

```javascript
var TCITLocalApi = require('tcitsdk-nodejs');
var localapiController = new TCITLocalApi();

var v = localapiController.getVersion();
```

### `[API] setServerInfo(host, port, wsPort)`

Set information of TCIT LocalAPI service

```javascript
var TCITLocalApi = require('tcitsdk-nodejs');
var localapiController = new TCITLocalApi();

localapiController.setServerInfo('localhost', "8800", "4662");
```

### `[API] imageBufferUpload(buffer)`

Upload image to TCIT LocalAPI Service using buffer

**[Function Input]**
 
- @param {object} buffer
 
**[Promise Resolve]**
 
- @object {string} img_id
 
**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

```javascript

var buffer = fs.readFileSync('./image/lena.jpg');
localapiController.imageBufferUpload(buffer).then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

### `[API] imagePathUpload(path)`

Upload image to TCIT LocalAPI Service using file path

**[Function Input]**
 
- @param {string} path
 
**[Promise Resolve]**
 
- @object {string} img_id
 
**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

```javascript

localapiController.imagePathUpload('./image/lena.jpg').then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

### `[API] faceDetect(imgId, img, trackId)`

Call Face Detection API on TCIT LocalAPI Service

**[Function Input]**
 
- @param {string} imgId
- @param {string} img (Base64 String)
- @param {string} trackId
 
**[Promise Resolve]**
 
- @object {object} faces
 
**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

```javascript

var bufferImg = fs.readFileSync('./image/lena.jpg');
localapiController.imageBufferUpload(bufferImg).then(function(res) {
    var imgId = res.img_id;
    localapiController.faceDetect(imgId, null, null).then(function(res) {
        console.log("Call API Success");
    });
}).catch(function(error) {
    console.log("Call API Error");
});


var base64Img = bufferImg.toString('base64');
localapiController.faceDetect(null, base64Img, null).then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

### `[API] createFaceTrack()`

**[Function Input]**
 
**[Promise Resolve]**
 
- @object {string} track_id
 
**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

```javascript

localapiController.createFaceTrack().then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

### `[API] deleteFaceTrack(trackId)`

**[Function Input]**
 
- @param {string} trackId
 
**[Promise Resolve]**
 
- @object {boolean} result
 
**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

```javascript

var trackId = null;
localapiController.createFaceTrack().then(function(res) {
    console.log("Call API Success");
    trackId = res.track_id;
}).catch(function(error) {
    console.log("Call API Error");
});

/*
Face Detection...
 */

localapiController.deleteFaceTrack(trackId).then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

### `[API] faceCompare(faceId1, faceId2)`

**[Function Input]**
 
- @param {string} faceId1
- @param {string} faceId2

**[Promise Resolve]**
 
- @object {number} similarity
 
**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

```javascript
var faceId1 = null;
var faceId2 = null;
/*
Upload Image and Face Detection...
 */

localapiController.faceCompare(faceId1, faceId2).then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

### `[API] createPerson(faceId, jsonStrFeatureList, groupId)`

**[Function Input]**
 
- @param {string} faceId
- @param {string} jsonStrFeatureList
- @param {string} groupId

**[Promise Resolve]**
 
- @object {string} person_id
- @object {number} added_face_count
- @object {number} added_group_count

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

```javascript

var faceId = null;
/*
Upload Image and Face Detection...
 */

localapiController.createPerson(faceId, null, null).then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

### `[API] deletePerson(personId)`

**[Function Input]**
 
- @param {string} personId

**[Promise Resolve]**
 
- @object {number} delete_count

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] addFaceToPerson(personId, faceId, jsonStrFeatureList)`

**[Function Input]**
 
- @param {string} personId
- @param {string} faceId
- @param {string} jsonStrFeatureList

**[Promise Resolve]**
 
- @object {number} added_face_count

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] removeFaceFromPerson(personId, faceId)`

**[Function Input]**
 
- @param {string} personId
- @param {string} faceId

**[Promise Resolve]**
 
- @object {number} removed_face_count

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] getPersonInfo(personId)`

**[Function Input]**
 
- @param {string} personId

**[Promise Resolve]**
 
- @object {string} person_id
- @object {object} faces
- @object {object} groups

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] queryPersonList()`

**[Function Input]**
 
**[Promise Resolve]**
 
- @object {object} persons

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] personVerify(personId, faceId, jsonStrFeature)`

**[Function Input]**
 
- @param {string} personId
- @param {string} faceId
- @param {string} jsonStrFeature

**[Promise Resolve]**
 
- @object {number} confidence

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] imagePersonVerify(imgBuffer, personId)`

**[Function Input]**
 
- @param {object} imgBuffer
- @param {string} personId

**[Promise Resolve]**
 
- @object {object} faces

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] createGroup(personId)`

**[Function Input]**
 
- @param {string} personId

**[Promise Resolve]**
 
- @object {string} group_id
- @object {number} added_person_count

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] deleteGroup(groupId)`

**[Function Input]**
 
- @param {string} groupId

**[Promise Resolve]**
 
- @object {number} delete_count

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] addPersonToGroup(groupId, personId)`

**[Function Input]**
 
- @param {string} groupId
- @param {string} personId

**[Promise Resolve]**
 
- @object {number} added_person_count

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

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

## Example

## Authors
Originally created by Marc Wang

## LICENSE

tcitsdk-nodejs is licensed under the Apache-2.0. For more information, see the LICENSE file in this repository.