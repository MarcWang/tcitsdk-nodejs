var WebSocket = require('ws');
var Promise = require("bluebird");
var zlib = require('zlib');
var needle = require('needle');

var TCIT_API_STORAGE_UPLOAD = '/storage/upload';

var TCIT_API_FACE_DETECT = '/face/detection/detect';
var TCIT_API_FACE_CREATE_TRACK = '/face/detection/trackstart';
var TCIT_API_FACE_DELETE_TRACK = '/face/detection/trackend';
var TCIT_API_FACE_COMPARISON = '/face/detection/compare';

var TCIT_API_PERSON_CREATE = '/face/person/create';
var TCIT_API_PERSON_DELETE = '/face/person/delete';
var TCIT_API_PERSON_ADD_FACE = '/face/person/update/add';
// var TCIT_API_PERSON_REMOVE_FACE = '/face/person/update/remove';
// var TCIT_API_PERSON_GET_INFO = '/face/person/info/get';
var TCIT_API_PERSON_QUERY_LIST = '/face/query/person_list';
var TCIT_API_PERSON_VERIFY = '/face/person/verify';

var TCIT_API_GROUP_CREATE = '/face/group/create';
var TCIT_API_GROUP_DELETE = '/face/group/delete';
// var TCIT_API_GROUP_ADD_PERSON = '/face/group/update/add'; 
// var TCIT_API_GROUP_REMOVE_PERSON = '/face/group/update/remove';
// var TCIT_API_GROUP_GET_INFO = '/face/group/info/get';
// var TCIT_API_GROUP_QUERY_LIST = '/face/query/group_list';
var TCIT_API_GROUP_IDENTIFY = '/face/group/identify';

var TCIT_API_CHANNEL_OPEN = '/channel/open';
var TCIT_API_CHANNEL_CLOSE = '/channel/close';
var TCIT_API_CHANNEL_GET_INFO = '/channel/info/get';
var TCIT_API_CHANNEL_QUERY_LIST = '/channel/query/channel_list';

var TCIT_API_QUERY_DEVICES = '/channel/query/device_list';

var TCIT_API_EXCHANGE_IMPORT = '/exchange/import';

var TCIT_STATE_SUCCESSFUL = 1000,
    TCIT_STATE_FAIL = 3000,
    TCIT_STATE_REQUEST_METHOD_ERROR = 3001,
    TCIT_STATE_PARAMETER_ERROR = 3002,
    TCIT_STATE_PROCESS_ERROR = 3003;

var TIME_CHANNEL_OPEN_DELAY = 500; //500ms

var localapi = function() {
    var self = this;
    self.version = '1.0.2';

    self.server = {
        host: 'localhost',
        port: 8800,
        wsPort: 4662
    };
    self.channels = {
        counts: 0,
        ids: [],
        ws: []
    };

}


localapi.prototype.getVersion = function() {
    var self = this;
    return self.version;
}

/*
 * @param {string} host
 * @param {number} port
 */
localapi.prototype.setServerInfo = function(host, port) {
    var self = this;
    if (typeof(host) == 'string' && typeof(port) == 'number') {
        self.server.host = host;
        self.server.port = port;
        return true;
    } else {
        return false;
    }
}

/* [API] Storage Upload
 * @param {object} buffer
 * @return {string} img_id
 */
localapi.prototype.imageBufferUpload = function(buffer) {
    var self = this;
    return new Promise(function(resolve, reject) {
        if (typeof(buffer) != 'object') {
            reject('NodeJS SDK Error');
        }

        var postData = {
            image: {
                buffer: buffer,
                content_type: 'image/jpeg'
            }
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_STORAGE_UPLOAD, postData, {
            multipart: true
        }, function(err, resp, body) {
            if (err) {
                reject(err);
            } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                var imgId = body.img_id;
                resolve(imgId);
            } else {
                reject('TCIT LocalAPI Response');
            }
        });
    });
}

/* [API] Storage Upload
 * @param {string} path
 * @return {string} img_id
 */
localapi.prototype.imagePathUpload = function(path) {
    var self = this;
    return new Promise(function(resolve, reject) {
        if (typeof(path) != 'string') {
            reject('NodeJS SDK Error');
        }

        var data = {
            image: {
                file: path,
                content_type: 'image/jpeg'
            }
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_STORAGE_UPLOAD, data, {
            multipart: true
        }, function(err, resp, body) {
            if (err) {
                reject(err);
            } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                var imgId = body.img_id;
                resolve(imgId);
            } else {
                reject('TCIT LocalAPI Response');
            }
        });
    });
}

/* [API] Face Detection
 * @param {string} imgId
 * @param {string} img (BASE64)
 * @param {string} trackId
 * @return {object} faces
 */
localapi.prototype.faceDetect = function(imgId, img, trackId) {
    var self = this;
    return new Promise(function(resolve, reject) {
        if (typeof(imgId) != 'string' && typeof(img) != 'string') {
            reject('NodeJS SDK Error');
        }

        var data = {
            img_id: imgId,
            image: img,
            track_id: trackId
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_FACE_DETECT, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    var faces = body.faces;
                    resolve(faces);
                } else {
                    reject('TCIT LocalAPI Response');
                }
            });
    });
}

/* [API] Create Face Tracked Detection
 * @return {string} track_id
 */
localapi.prototype.createFaceTrack = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        needle.get('http://' + self.server.host + ':' + self.server.port + TCIT_API_FACE_CREATE_TRACK,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    var trackId = body.track_id;
                    resolve(trackId);
                } else {
                    reject('TCIT LocalAPI Response');
                }
            });
    });
}

/* [API] Delete Face Tracked Detection
 * @param {string} trackId
 * @return {boolean} true
 */
localapi.prototype.deleteFaceTrack = function(trackId) {
    var self = this;
    return new Promise(function(resolve, reject) {
        if (typeof(trackId) != 'string') {
            reject('NodeJS SDK Error');
        }
        var data = {
            track_id: trackId
        }
        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_FACE_DELETE_TRACK, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve(true);
                } else {
                    reject('TCIT LocalAPI Response');
                }
            });
    });
}

/* [API] Face Comparison
 * @param {string} faceId1
 * @param {string} faceId2
 * @return {number} similarity
 */
localapi.prototype.faceCompare = function(faceId1, faceId2) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(faceId1) != 'string' || typeof(faceId2) != 'string') {
            reject('NodeJS SDK Error');
        }
        var data = {
            face_id1: faceId1,
            face_id2: faceId2
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_FACE_COMPARISON, data, function(err, resp, body) {
            if (err) {
                reject(err);
            } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                var score = body.similarity;
                resolve(score);
            } else {
                reject('TCIT LocalAPI Response');
            }
        });
    });
}


localapi.prototype.queryDeviceList = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        needle.get('http://' + self.server.host + ':' + self.server.port + TCIT_API_QUERY_DEVICES, function(err, resp, body) {
            if (err) {
                reject(err);
            } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                var devices = body.devices;
                resolve(devices);
            } else {
                reject({
                    error: 'TCIT LocalAPI Response',
                    code: body.state
                });
            }
        });
    });
}

function connectLocalApiWebSocket(id) {
    var self = this;
    var wsurl = 'ws://' + self.server.host + ':4662';
    var channelId = id;
    var ws = new WebSocket(wsurl);
    self.channels.ws.push({
        id: channelId,
        ws: ws,
        status: false
    });

    ws.on('open', function() {
        var channel = {
            channel_id: channelId
        };
        var json = JSON.stringify(channel);
        ws.send(json);
    });
}

function disconnectLocalApiWebSocket(channelId) {
    var self = this;
    var wsurl = 'ws://' + self.server.host + ':4662';
    self.channels.ws.forEach(function(wsData) {
        if (wsData.id == channelId) {
            wsData.ws.close();
            wsData.ws = null;
        }
    });
}

localapi.prototype.listenWebSocketMsg = function(callback) {
    var self = this;

    self.channels.ws.forEach(function(wsData) {
        if (!wsData.status) {
            console.log(wsData.id);
            wsData.status = true;
            wsData.ws.on('message', function(data, flags) {
                if (flags.binary) {
                    zlib.gunzip(data, function(err, buffer) {
                        if (err) {
                            console.log('decompress error:' + err);
                            return;
                        }
                        var json = JSON.parse(buffer.toString());

                        callback({
                            id: wsData.id,
                            data: json
                        });
                    });
                } else {}
            });
        }
        wsData.ws.on('close', function(code, msg) {});
    })
}

localapi.prototype.openMultiChannels = function(urls, params) {
    var self = this;
    return new Promise(function(resolve, reject) {
        var delay = 0;
        length = 0;
        counts = 0;

        if (typeof(urls) == 'undefined' || typeof(params) == 'undefined') {
            reject({
                error: "parameters is error",
                code: -1
            });
        }

        length = urls.length;
        if (length == 0) {
            reject({
                error: "parameters is error",
                code: -1
            });
        }

        urls.forEach(function(url) {
            (function() {
                setTimeout(function() {
                    self.openChannel(url, params).then(function(res) {
                        var channelId = res;
                        console.log("open channel , id = " + channelId);
                        counts++;
                        if (length == counts) {
                            resolve(self.channels.ids);
                        }
                    }).catch(function(error) {
                        reject({
                            error: error,
                            code: -1
                        });
                    });
                }, delay);
            }());
            delay += TIME_CHANNEL_OPEN_DELAY;
        });
    });
}

localapi.prototype.closeAllChannels = function() {
    var self = this;

    return new Promise(function(resolve, reject) {
        var channelIds = self.channels.ids;
        var length = channelIds.length;
        var counts = 0;

        if (channelIds.length == 0) {
            resolve("close");
        }

        channelIds.forEach(function(id) {
            self.closeChannel(id).then(function(res) {
                counts++;
                if (counts == length) {
                    resolve("close");
                }
            }).catch(function(error) {
                reject({
                    error: error,
                    code: -1
                });
            });
        });
    });
}

localapi.prototype.openChannel = function(url, params) {
    var self = this;
    return new Promise(function(resolve, reject) {

        var data = {
            url: url,
            settings: JSON.stringify(params)
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_CHANNEL_OPEN, data, {
            timeout: 10000
        }, function(err, resp, body) {
            if (err) {
                reject(err);
            } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                var channelId = body.channel_id;
                self.channels.counts++;
                self.channels.ids.push(channelId);
                connectLocalApiWebSocket.call(self, channelId);
                resolve(channelId);
            } else {
                reject({
                    error: 'TCIT LocalAPI Response',
                    code: body.state
                });
            }
        });

    });
}

localapi.prototype.closeChannel = function(channelId) {
    var self = this;
    return new Promise(function(resolve, reject) {

        var data = {
            channel_id: channelId
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_CHANNEL_CLOSE, data, {
            timeout: 5000
        }, function(err, resp, body) {
            if (err) {
                reject(err);
            } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                self.channels.counts--;
                if (self.channels.counts == 0) {
                    disconnectLocalApiWebSocket.call(self, channelId);
                }
                resolve(self.channels.counts);
            } else {
                reject({
                    error: 'TCIT LocalAPI Response',
                    code: body.state
                });
            }
        });
    });
}

//[API] Query Channel List
localapi.prototype.queryChannelList = function(url) {
    var self = this;
    return new Promise(function(resolve, reject) {
        needle.get('http://' + self.server.host + ':' + self.server.port + TCIT_API_CHANNEL_QUERY_LIST, function(err, resp, body) {
            if (err) {
                reject(err);
            } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                resolve(body.channels);
            } else {
                reject({
                    error: 'TCIT LocalAPI Response',
                    code: body.state
                });
            }
        });
    });
}


//[API] Query Channel List
localapi.prototype.getChannelInfo = function(id) {
    var self = this;
    return new Promise(function(resolve, reject) {
        var data = {
            channel_id: id
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_CHANNEL_GET_INFO, data, {
            timeout: 2000
        }, function(err, resp, body) {
            if (err) {
                reject(err);
            } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                resolve(body.channels);
            } else {
                reject({
                    error: 'TCIT LocalAPI Response',
                    code: body.state
                });
            }
        });
    });
}

//[API] Create Person
localapi.prototype.createPerson = function(faceId, jsonStrFeatureList, groupId) {
    var self = this;
    return new Promise(function(resolve, reject) {
        var data = {
            face_id: faceId,
            feature_list: jsonStrFeatureList,
            group_id: groupId
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_PERSON_CREATE, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve({
                        person_id: body.person_id,
                        added_face_count: body.added_face_count,
                        added_group_count: body.added_group_count
                    });
                } else {
                    reject({
                        error: 'TCIT LocalAPI Response',
                        code: body.state
                    });
                }
            });
    });
}

//[API] Delete Person
localapi.prototype.deletePerson = function(personId) {
    var self = this;
    return new Promise(function(resolve, reject) {
        var data = {
            person_id: personId,
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_PERSON_DELETE, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve(body.delete_count);
                } else {
                    reject({
                        error: 'TCIT LocalAPI Response',
                        code: body.state
                    });
                }
            });
    });
}

//[API] Add face to Person
localapi.prototype.addFaceToPerson = function(personId, faceId, jsonStrFeatureList) {
    var self = this;
    return new Promise(function(resolve, reject) {
        var data = {
            person_id: personId,
            face_id: faceId,
            feature_list: jsonStrFeatureList
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_PERSON_ADD_FACE, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve(body);
                } else {
                    reject({
                        error: 'TCIT LocalAPI Response',
                        code: body.state
                    });
                }
            });
    });
}

//[API] Query Person List
localapi.prototype.queryPersonList = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        needle.get('http://' + self.server.host + ':' + self.server.port + TCIT_API_PERSON_QUERY_LIST,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve(body.persons);
                } else {
                    reject({
                        error: 'TCIT LocalAPI Response',
                        code: body.state
                    });
                }
            });
    });
}


//[API] Verify Person
localapi.prototype.verify = function(personId, faceId, jsonStrFeature) {
    var self = this;
    return new Promise(function(resolve, reject) {
        var data = {
            person_id: personId,
            feature_data: jsonStrFeature,
            face_id: faceId
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_PERSON_VERIFY, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    console.log(body);
                    // resolve(body.confidence);
                } else {
                    reject({
                        error: 'TCIT LocalAPI Response',
                        code: body.state
                    });
                }
            });
    });
}


//[API] Create Group
localapi.prototype.createGroup = function(personId) {
    var self = this;
    return new Promise(function(resolve, reject) {
        var data = {
            person_id: personId
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_GROUP_CREATE, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve({
                        group_id: body.group_id,
                        added_person_count: body.added_person_count
                    });
                } else {
                    reject({
                        error: 'TCIT LocalAPI Response',
                        code: body.state
                    });
                }
            });
    });
}

//[API] Delete Group
localapi.prototype.deleteGroup = function(groupId) {
    var self = this;
    return new Promise(function(resolve, reject) {
        var data = {
            group_id: groupId,
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_GROUP_DELETE, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve(body.delete_count);
                } else {
                    reject({
                        error: 'TCIT LocalAPI Response',
                        code: body.state
                    });
                }
            });
    });
}


//[API] Identify Group
localapi.prototype.identify = function(groupId, faceId, featureData) {
    var self = this;
    return new Promise(function(resolve, reject) {
        var data = {
            group_id: groupId,
            feature_data: featureData,
            face_id: faceId
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_GROUP_IDENTIFY, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve(body.persons);
                } else {
                    reject({
                        error: 'TCIT LocalAPI Response',
                        code: body.state
                    });
                }
            });
    });
}

//[API] Import Feature Data
localapi.prototype.importFeatureStr = function(importStr) {
    var self = this;
    return new Promise(function(resolve, reject) {
        var data = {
            import_string: importStr
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_EXCHANGE_IMPORT, data,
            function(err, resp, body) {
                if (err) {
                    reject(false);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve(true);
                } else {
                    reject({
                        error: 'TCIT LocalAPI Response',
                        code: body.state
                    });
                }
            });
    });
}

module.exports = localapi;
