
![logo](https://github.com/MarcWang/tcitsdk-nodejs/blob/master/tcit_logo.png)

[![npm](https://img.shields.io/npm/v/tcitsdk-nodejs.svg)](https://www.npmjs.com/package/tcitsdk-nodejs)[![Travis](https://img.shields.io/travis/MarcWang/tcitsdk-nodejs.svg)](https://travis-ci.org/MarcWang/tcitsdk-nodejs)[![Coveralls](https://img.shields.io/coveralls/marcwang/tcitsdk-nodejs.svg)](https://coveralls.io/github/MarcWang/tcitsdk-nodejs)

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

localapiController.setServerInfo('localhost', 8800, 4662);
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

```javascript

var personId = null;
/*
call createPerson api...
 */

localapiController.deletePerson(personId).then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

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

```javascript

var personId = null;
var faceId = null;
/*
get person_id from createPerson api...
get face_id from faceDetect api...
 */

localapiController.addFaceToPerson(personId, faceId, null).then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

### `[API] removeFaceFromPerson(personId, faceId)`

**[Function Input]**
 
- @param {string} personId
- @param {string} faceId

**[Promise Resolve]**
 
- @object {number} removed_face_count

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

```javascript

var personId = null;
var faceId = null;
/*
existed face_id and person_id
 */

localapiController.removeFaceFromPerson(personId, faceId).then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

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

```javascript

var personId = null;
/*
existed person_id
 */

localapiController.getPersonInfo(personId).then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

### `[API] queryPersonList()`

**[Function Input]**
 
**[Promise Resolve]**
 
- @object {object} persons

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

```javascript

localapiController.queryPersonList().then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

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

```javascript

var personId = null;
var faceId = null;
var jsonStrFeature = null;
/*
get face_id from faceDetect api
existed person_id 
 */

localapiController.personVerify(personId, faceId, jsonStrFeature).then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

### `[API] imagePersonVerify(imgBuffer, personId)`

**[Function Input]**
 
- @param {object} imgBuffer
- @param {string} personId

**[Promise Resolve]**
 
- @object {object} faces

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

```javascript

var personId = null;
var imgBuffer = fs.readFileSync(__dirname + '/../../image/lena.jpg');
/*
existed person_id 
 */

localapiController.imagePersonVerify(imgBuffer, personId).then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

### `[API] createGroup(personId)`

**[Function Input]**
 
- @param {string} personId

**[Promise Resolve]**
 
- @object {string} group_id
- @object {number} added_person_count

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

```javascript

var personId = null;
/*
PreProcess
 */

localapiController.createGroup(personId).then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

### `[API] deleteGroup(groupId)`

**[Function Input]**
 
- @param {string} groupId

**[Promise Resolve]**
 
- @object {number} delete_count

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

```javascript

var groupId = null;
/*
call createPerson api...
 */

localapiController.deleteGroup(groupId).then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

### `[API] addPersonToGroup(groupId, personId)`

**[Function Input]**
 
- @param {string} groupId
- @param {string} personId

**[Promise Resolve]**
 
- @object {number} added_person_count

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

```javascript

var personId = null;
var faceId = null;
/*
get groupId from createGroup api...
get personId from createPerson api...
 */

localapiController.addPersonToGroup(groupId, personId).then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

### `[API] removePersonFromGroup(groupId, personId)`

**[Function Input]**
 
- @param {string} groupId
- @param {string} personId

**[Promise Resolve]**
 
- @object {number} removed_person_count

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

```javascript

var groupId = null;
var personId = null;
/*
existed group_id and person_id
 */

localapiController.removePersonFromGroup(groupId, personId).then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

### `[API] getGroupInfo(groupId)`

**[Function Input]**
 
- @param {string} groupId

**[Promise Resolve]**
 
- @object {string} group_id
- @object {object} persons

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] queryGroupList()`

**[Function Input]**

**[Promise Resolve]**

- @object {object} groups

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] groupIdentify(groupId, faceId, featureData)`

**[Function Input]**
 
- @param {string} groupId
- @param {string} faceId
- @param {string} featureData

**[Promise Resolve]**
 
- @object {object} persons

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] humanDetect(imgId, img, trackId)`

**[Function Input]**
 
- @param {string} imgId
- @param {string} img (Base64 String)
- @param {string} trackId

**[Promise Resolve]**
 
- @object {object} humans

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

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

**[Function Input]**

**[Promise Resolve]**
 
- @object {string} track_id

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

```javascript

localapiController.createHumanTrack().then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

### `[API] deleteHumanTrack(trackId)`

**[Function Input]**

- @param {string} trackId

**[Promise Resolve]**
 
- @object {boolean} result

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

```javascript
var trackId = null;
/*
get trackId from createHumanTrack api
 */

localapiController.deleteHumanTrack(trackId).then(function(res) {
    console.log("Call API Success");
}).catch(function(error) {
    console.log("Call API Error");
});
```

### `[API] openChannel(url, channelParam)`

**[Function Input]**

- @param {string} url
- @param {object} channelParam

**[Promise Resolve]**
 
- @object {string} channel_id

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] openMultiChannels(urls, channelParam)`

**[Function Input]**

- @param {object} urls
- @param {object} channelParam

**[Promise Resolve]**
 
- @object {string} channel_id

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] closeChannel(channelId)`

**[Function Input]**

- @param {string} channelId

**[Promise Resolve]**
 
- @object {boolean} result

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] closeAllChannels()`

**[Function Input]**

**[Promise Resolve]**
 
- @object {boolean} result

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] getChannelInfo(channelId)`

**[Function Input]**

- @param {string} channelId

**[Promise Resolve]**
 
- @object {object} channels

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] queryChannelList()`

**[Function Input]**

**[Promise Resolve]**
 
- @object {object} channels

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] getDeviceInfo(url)`

**[Function Input]**

- @param {string} url

**[Promise Resolve]**
 
- @object {string} url
- @object {object} resolutions

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] queryDeviceList()`

**[Function Input]**

**[Promise Resolve]**
 
- @object {object} devices

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] listenWebSocketMsg(callback)`

**[Function Input]**

- @param {function} callback

**[Callback]**
 
- @object {string} id
- @object {object} data

### `[API] restartServer()`

**[Function Input]**

**[Promise Resolve]**
 
- @object {boolean} result

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] importFeatureStr(importStr)`

**[Function Input]**

- @param {string} importStr

**[Promise Resolve]**
 
- @object {boolean} result

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

### `[API] importFeatureFile(importFile)`

**[Function Input]**

- @param {object} importFile

**[Promise Resolve]**
 
- @object {boolean} result

**[Promise Reject]**
 
- @object {string} localapi
- @object {string} nodejs

## Example

## Authors
Originally created by Marc Wang

## LICENSE

tcitsdk-nodejs is licensed under the Apache-2.0. For more information, see the LICENSE file in this repository.
