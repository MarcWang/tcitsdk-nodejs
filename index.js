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
var TCIT_API_PERSON_REMOVE_FACE = '/face/person/update/remove';
var TCIT_API_PERSON_GET_INFO = '/face/person/info/get';
var TCIT_API_PERSON_QUERY_LIST = '/face/query/person_list';
var TCIT_API_PERSON_VERIFY = '/face/person/verify';
var TCIT_API_PERSON_IMAGE_VERIFY = '/face/person/image/verify';

var TCIT_API_GROUP_CREATE = '/face/group/create';
var TCIT_API_GROUP_DELETE = '/face/group/delete';
var TCIT_API_GROUP_ADD_PERSON = '/face/group/update/add';
var TCIT_API_GROUP_REMOVE_PERSON = '/face/group/update/remove';
var TCIT_API_GROUP_GET_INFO = '/face/group/info/get';
var TCIT_API_GROUP_QUERY_LIST = '/face/query/group_list';
var TCIT_API_GROUP_IDENTIFY = '/face/group/identify';

var TCIT_API_HUMAN_DETECT = '/human/detection/detect';
var TCIT_API_HUMAN_CREATE_TRACK = '/human/detection/trackstart';
var TCIT_API_HUMAN_DELETE_TRACK = '/human/detection/trackend';

var TCIT_API_CHANNEL_OPEN = '/channel/open';
var TCIT_API_CHANNEL_CLOSE = '/channel/close';
var TCIT_API_CHANNEL_GET_INFO = '/channel/info/get';
var TCIT_API_CHANNEL_QUERY_LIST = '/channel/query/channel_list';
var TCIT_API_CHANNEL_DEVICE_GET_INFO = '/channel/device/info/get';
var TCIT_API_CHANNEL_DEVICE_QUERY_LIST = '/channel/query/device_list';

var TCIT_API_SYSTEM_RESTART = '/system/restart';
var TCIT_API_EXCHANGE_IMPORT = '/exchange/import';

var TCIT_STATE_SUCCESSFUL = 1000,
    TCIT_STATE_FAIL = 3000,
    TCIT_STATE_REQUEST_METHOD_ERROR = 3001,
    TCIT_STATE_PARAMETER_ERROR = 3002,
    TCIT_STATE_PROCESS_ERROR = 3003;

var NODEJS_STATE_TYPE_ERROR = 5001;

var TIMEDELAY_OPEN_CHANNEL = 500; //500ms
var TIMEOUT_OPEN_CHANNEL = 10000;

var RESPONSE_TYPE_ERROR = {
    localapi: null,
    nodejs: NODEJS_STATE_TYPE_ERROR
}

var localapi = function() {
    var self = this;
    self.version = '1.0.4';

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

/*
 * [Function Input]
 * [Function Return]
 * @object {boolean} true
 */
localapi.prototype.getVersion = function() {
    var self = this;
    return self.version;
}

/*
 * [Function Input]
 * @param {string} host
 * @param {number} port
 * [Function Return]
 * @object {boolean} true
 */
localapi.prototype.setServerInfo = function(host, port, wsPort) {
    var self = this;
    if (typeof(host) == 'string' && typeof(port) == 'number' && typeof(wsPort) == 'number') {
        self.server.host = host;
        self.server.port = port;
        self.server.wsPort = wsPort;
        return true;
    } else {
        return false;
    }
}

/* [API] Storage Upload
 * [Function Input]
 * @param {object} buffer
 * [Promise Resolve]
 * @object {string} img_id
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.imageBufferUpload = function(buffer) {
    var self = this;
    return new Promise(function(resolve, reject) {
        if (typeof(buffer) != 'object') {
            reject(RESPONSE_TYPE_ERROR);
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
                resolve({
                    img_id: body.img_id
                });
            } else {
                reject({
                    localapi: body.state,
                    nodejs: null
                });
            }
        });
    });
}

/* [API] Storage Upload
 * [Function Input]
 * @param {string} path
 * [Promise Resolve]
 * @object {string} img_id
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.imagePathUpload = function(path) {
    var self = this;
    return new Promise(function(resolve, reject) {
        if (typeof(path) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
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
                resolve({
                    img_id: body.img_id
                });
            } else {
                reject({
                    localapi: body.state,
                    nodejs: null
                });
            }
        });
    });
}

/* [API] Face Detection
 * [Function Input]
 * @param {string} imgId
 * @param {string} img (Base64 String)
 * @param {string} trackId
 * [Promise Resolve]
 * @object {object} faces
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.faceDetect = function(imgId, img, trackId) {
    var self = this;
    return new Promise(function(resolve, reject) {
        if (typeof(imgId) != 'string' && typeof(img) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
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
                    resolve({
                        faces: body.faces
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Create Face Tracked Detection
 * [Function Input]
 * [Promise Resolve]
 * @object {string} track_id
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.createFaceTrack = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        needle.get('http://' + self.server.host + ':' + self.server.port + TCIT_API_FACE_CREATE_TRACK,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve({
                        treck_id: body.track_id
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Delete Face Tracked Detection
 * [Function Input]
 * @param {string} trackId
 * [Promise Resolve]
 * @object {boolean} result
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.deleteFaceTrack = function(trackId) {
    var self = this;
    return new Promise(function(resolve, reject) {
        if (typeof(trackId) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }
        var data = {
            track_id: trackId
        }
        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_FACE_DELETE_TRACK, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve({
                        result: true
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Face Comparison
 * [Function Input]
 * @param {string} faceId1
 * @param {string} faceId2
 * [Promise Resolve]
 * @object {number} similarity
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.faceCompare = function(faceId1, faceId2) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(faceId1) != 'string' || typeof(faceId2) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }
        var data = {
            face_id1: faceId1,
            face_id2: faceId2
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_FACE_COMPARISON, data, function(err, resp, body) {
            if (err) {
                reject(err);
            } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                resolve({
                    similarity: body.similarity
                });
            } else {
                reject({
                    localapi: body.state,
                    nodejs: null
                });
            }
        });
    });
}

/* [API] Create Person
 * [Function Input]
 * @param {string} faceId
 * @param {string} jsonStrFeatureList
 * @param {string} groupId
 * [Promise Resolve]
 * @object {string} person_id
 * @object {number} added_face_count
 * @object {number} added_group_count
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.createPerson = function(faceId, jsonStrFeatureList, groupId) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(faceId) != 'string' && typeof(jsonStrFeatureList) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

        if (typeof(groupId) != 'string') {
            if (groupId != null) {
                reject(RESPONSE_TYPE_ERROR);
            }
        }

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
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Delete Person
 * [Function Input]
 * @param {string} personId
 * [Promise Resolve]
 * @object {number} delete_count
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.deletePerson = function(personId) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(personId) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

        var data = {
            person_id: personId,
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_PERSON_DELETE, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve({
                        delete_count: body.delete_count
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Add face to Person
 * [Function Input]
 * @param {string} personId
 * @param {string} faceId
 * @param {string} jsonStrFeatureList
 * [Promise Resolve]
 * @object {number} added_face_count
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.addFaceToPerson = function(personId, faceId, jsonStrFeatureList) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(faceId) != 'string' && typeof(jsonStrFeatureList) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

        if (typeof(personId) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

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
                    resolve({
                        added_face_count: body.added_face_count
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Remove face from Person
 * [Function Input]
 * @param {string} personId
 * @param {string} faceId
 * [Promise Resolve]
 * @object {number} removed_face_count
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.removeFaceFromPerson = function(personId, faceId) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(personId) != 'string' || typeof(faceId) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

        var data = {
            person_id: personId,
            face_id: faceId
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_PERSON_REMOVE_FACE, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve({
                        removed_face_count: body.removed_face_count
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Get Person Info
 * [Function Input]
 * @param {string} personId
 * [Promise Resolve]
 * @object {string} person_id
 * @object {object} faces
 * @object {object} groups
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.getPersonInfo = function(personId) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(personId) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

        var data = {
            person_id: personId
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_PERSON_GET_INFO, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve({
                        faces: body.faces,
                        groups: body.groups,
                        person_id: body.person_id
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Query Person List
 * [Function Input]
 * [Promise Resolve]
 * @object {object} persons
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.queryPersonList = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        needle.get('http://' + self.server.host + ':' + self.server.port + TCIT_API_PERSON_QUERY_LIST,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve({
                        persons: body.persons
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Person Verify
 * [Function Input]
 * @param {string} personId
 * @param {string} faceId
 * @param {string} jsonStrFeature
 * [Promise Resolve]
 * @object {number} confidence
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.personVerify = function(personId, faceId, jsonStrFeature) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(personId) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

        if (typeof(faceId) != 'string' && typeof(jsonStrFeature) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

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
                    resolve({
                        confidence: body.confidence
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Image Person Verify
 * [Function Input]
 * @param {string} personId
 * @param {object} imgBuffer
 * [Promise Resovle]
 * @object {object} faces
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.imagePersonVerify = function(imgBuffer, personId) {
    var self = this;
    return new Promise(function(resolve, reject) {
        if (typeof(imgBuffer) != 'object') {
            reject(RESPONSE_TYPE_ERROR);
        }

        if (typeof(personId) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

        var data = {
            person_id: personId,
            image: {
                buffer: imgBuffer,
                content_type: 'image/jpeg'
            }
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_PERSON_IMAGE_VERIFY, data, {
            multipart: true
        }, function(err, resp, body) {
            if (err) {
                reject(err);
            } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                resolve({
                    faces: body.faces
                });
            } else {
                reject({
                    localapi: body.state,
                    nodejs: null
                });
            }
        });
    });
}

/* [API] Create Group
 * [Function Input]
 * @param {string} personId
 * [Promise Resovle]
 * @object {number} added_person_count
 * @object {string} group_id
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.createGroup = function(personId) {
    var self = this;
    return new Promise(function(resolve, reject) {
        if (personId != null && typeof(personId) != 'undefined') {
            if (typeof(personId) != 'string') {
                reject(RESPONSE_TYPE_ERROR);
            }
        }

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
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Delete Group
 * [Function Input]
 * @param {string} groupId
 * [Promise Resovle]
 * @object {number} delete_count
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.deleteGroup = function(groupId) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(groupId) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

        var data = {
            group_id: groupId
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_GROUP_DELETE, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve({
                        delete_count: body.delete_count
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Add Person to Group
 * [Function Input]
 * @param {string} groupId
 * @param {string} personId
 * [Promise Resovle]
 * @object {number} added_person_count
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.addPersonToGroup = function(groupId, personId) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(groupId) != 'string' || typeof(personId) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

        var data = {
            group_id: groupId,
            person_id: personId
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_GROUP_ADD_PERSON, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve({
                        added_person_count: body.added_person_count
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Remove Person from Group
 * [Function Input]
 * @param {string} groupId
 * @param {string} personId
 * [Promise Resolve]
 * @object {number} removed_person_count
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.removePersonFromGroup = function(groupId, personId) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(groupId) != 'string' || typeof(personId) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

        var data = {
            group_id: groupId,
            person_id: personId
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_GROUP_REMOVE_PERSON, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve({
                        removed_person_count: body.removed_person_count
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Get Group Information
 * [Function Input]
 * @param {string} groupId
 * [Promise Resolve]
 * @object {string} group_id
 * @object {object} persons
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.getGroupInfo = function(groupId) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(groupId) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

        var data = {
            group_id: groupId
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_GROUP_GET_INFO, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve({
                        persons: body.persons,
                        group_id: body.group_id
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Query Group List
 * [Function Input]
 * [Promise Resolve]
 * @object {object} groups
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.queryGroupList = function() {
    var self = this;
    return new Promise(function(resolve, reject) {

        needle.get('http://' + self.server.host + ':' + self.server.port + TCIT_API_GROUP_QUERY_LIST,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve({
                        groups: body.groups
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}


/* [API] Group Identify
 * [Function Input]
 * @param {string} groupId
 * @param {string} faceId
 * @param {string} featureData
 * [Promise Resolve]
 * @object {object} persons
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.groupIdentify = function(groupId, faceId, featureData) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(groupId) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

        if (typeof(faceId) != 'string' && typeof(featureData) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

        var data = {
            group_id: groupId,
            feature_data: featureData,
            face_id: faceId
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_GROUP_IDENTIFY, data, {
            timeout: 10000
        }, function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve({
                        persons: body.persons
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Human Detection
 * [Function Input]
 * @param {string} imgId
 * @param {string} img (Base64 String)
 * @param {string} trackId
 * [Promise Resolve]
 * @object {object} humans
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.humanDetect = function(imgId, img, trackId) {
    var self = this;
    return new Promise(function(resolve, reject) {
        if (typeof(imgId) != 'string' && typeof(img) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

        var data = {
            img_id: imgId,
            image: img,
            track_id: trackId
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_HUMAN_DETECT, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve({
                        humans: body.humans
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Create Human Tracked Detection
 * [Function Input]
 * [Promise Resolve]
 * @object {string} track_id
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.createHumanTrack = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        needle.get('http://' + self.server.host + ':' + self.server.port + TCIT_API_HUMAN_CREATE_TRACK,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve({
                        treck_id: body.track_id
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Delete Human Tracked Detection
 * [Function Input]
 * @param {string} trackId
 * [Promise Resovle]
 * @object {boolean} result
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.deleteHumanTrack = function(trackId) {
    var self = this;
    return new Promise(function(resolve, reject) {
        if (typeof(trackId) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }
        var data = {
            track_id: trackId
        }
        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_HUMAN_DELETE_TRACK, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve({
                        result: true
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}


/* [API] Open Channel
 * [Function Input]
 * @param {string} url
 * @param {object} channelParam
 * [Promise Resolve]
 * @object {string} channel_id
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.openChannel = function(url, channelParam) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(url) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

        if (typeof(channelParam) != 'undefined') {
            if (typeof(channelParam) != 'object') {
                reject({
                    localapi: null,
                    nodejs: NODEJS_STATE_TYPE_ERROR
                });
            }
        }

        var data = {
            url: url,
            settings: JSON.stringify(channelParam)
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_CHANNEL_OPEN, data, {
            timeout: TIMEOUT_OPEN_CHANNEL
        }, function(err, resp, body) {
            if (err) {
                reject(err);
            } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                var channelId = body.channel_id;
                self.channels.counts++;
                self.channels.ids.push(channelId);
                connectLocalApiWebSocket.call(self, channelId);
                resolve({
                    channel_id: body.channel_id
                });
            } else {
                reject({
                    localapi: body.state,
                    nodejs: null
                });
            }
        });
    });
}

/* [API] Open Multi Channels
 * [Function Input]
 * @param {object} urls
 * @param {object} channelParam
 * [Promise Resolve]
 * @object {object} channel_ids
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.openMultiChannels = function(urls, channelParam) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(urls) != 'object') {
            reject(RESPONSE_TYPE_ERROR);
        }

        if (typeof(channelParam) != 'undefined') {
            if (typeof(channelParam) != 'object') {
                reject(RESPONSE_TYPE_ERROR);
            }
        }

        var delay = 0,
            length = urls.length,
            counts = 0;

        if (length == 0) {
            reject({
                localapi: null,
                nodejs: NODEJS_STATE_TYPE_ERROR
            });
        }

        urls.forEach(function(url) {
            (function() {
                setTimeout(function() {
                    self.openChannel(url, channelParam).then(function(res) {
                        var channelId = res.channel_id;
                        // console.log("open channel , id = " + channelId);
                        counts++;
                        if (length == counts) {
                            resolve({
                                channel_ids: self.channels.ids
                            });
                        }
                    }).catch(function(error) {
                        reject({
                            localapi: body.state,
                            nodejs: null
                        });
                    });
                }, delay);
            }());
            delay += TIMEDELAY_OPEN_CHANNEL;
        });
    });
}

/* [API] Close Channel
 * [Function Input]
 * @param {string} channelId
 * [Promise Resolve]
 * @object {boolean} result
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.closeChannel = function(channelId) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(channelId) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

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
                resolve({
                    result: true
                });
            } else {
                reject({
                    localapi: body.state,
                    nodejs: null
                });
            }
        });
    });
}

/* [API] Close All Channels
 * [Function Input]
 * [Promise Resolve]
 * @object {boolean} result
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.closeAllChannels = function() {
    var self = this;

    return new Promise(function(resolve, reject) {
        var channelIds = self.channels.ids;
        var length = channelIds.length;
        var counts = 0;

        if (channelIds.length == 0) {
            resolve({
                result: true
            });
        }

        channelIds.forEach(function(id) {
            self.closeChannel(id).then(function(res) {
                counts++;
                if (counts == length) {
                    resolve({
                        result: true
                    });
                }
            }).catch(function(error) {
                reject({
                    localapi: body.state,
                    nodejs: null
                });
            });
        });
    });
}

/* [API] Get Channel Info
 * [Function Input]
 * @param {string} channelId
 * [Promise Resolve]
 * @object {object} channels
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.getChannelInfo = function(channelId) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(channelId) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

        var data = {
            channel_id: channelId
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_CHANNEL_GET_INFO, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve({
                        channels: body.channels
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Query Channel List
 * [Function Input]
 * [Promise Resolve]
 * @object {object} channels
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.queryChannelList = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        needle.get('http://' + self.server.host + ':' + self.server.port + TCIT_API_CHANNEL_QUERY_LIST, function(err, resp, body) {
            if (err) {
                reject(err);
            } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                resolve({
                    channels: body.channels
                });
            } else {
                reject({
                    localapi: body.state,
                    nodejs: null
                });
            }
        });
    });
}

/* [API] Get Device Info
 * [Function Input]
 * @param {string} url
 * [Promise Resolve]
 * @object {string} url
 * @object {object} resolutions
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.getDeviceInfo = function(url) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(url) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }
        var data = {
            url: url
        }
        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_CHANNEL_DEVICE_GET_INFO, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    var devices = body.devices;
                    resolve({
                        url: body.url,
                        resolutions: body.resolutions
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Query Device List
 * [Function Input]
 * @param {string} url
 * [Promise Resolve]
 * @object {object} devices
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.queryDeviceList = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        needle.get('http://' + self.server.host + ':' + self.server.port + TCIT_API_CHANNEL_DEVICE_QUERY_LIST, function(err, resp, body) {
            if (err) {
                reject(err);
            } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                resolve({
                    devices: body.devices
                });
            } else {
                reject({
                    localapi: body.state,
                    nodejs: null
                });
            }
        });
    });
}

function connectLocalApiWebSocket(id) {
    var self = this;
    var wsurl = 'ws://' + self.server.host + ':' + self.server.wsPort;
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
    var wsurl = 'ws://' + self.server.host + ':' + self.server.wsPort;
    self.channels.ws.forEach(function(wsData) {
        if (wsData.id == channelId) {
            wsData.ws.close();
            wsData.ws = null;
        }
    });
}

/* [API] Listen WebSocket Message
 * [Function Input]
 * @param {function} callback
 * [Callback]
 * @object {string} id
 * @object {object} data
 */
localapi.prototype.listenWebSocketMsg = function(callback) {
    var self = this;

    self.channels.ws.forEach(function(wsData) {
        if (!wsData.status) {
            // console.log(wsData.id);
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

/* [API] Restart Server
 * [Function Input]
 * [Promise Resolve]
 * @object {boolean} result
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.restartServer = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        needle.get('http://' + self.server.host + ':' + self.server.port + TCIT_API_SYSTEM_RESTART, function(err, resp, body) {
            if (err) {
                reject(err);
            } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                resolve({
                    result: true
                });
            } else {
                reject({
                    localapi: body.state,
                    nodejs: null
                });
            }
        });
    });
}

/* [API] Import Feature Data
 * [Function Input]
 * @param {string} importStr
 * [Promise Resolve]
 * @object {boolean} result
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.importFeatureStr = function(importStr) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(importStr) != 'string') {
            reject(RESPONSE_TYPE_ERROR);
        }

        var data = {
            import_string: importStr
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_EXCHANGE_IMPORT, data,
            function(err, resp, body) {
                if (err) {
                    reject(err);
                } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                    resolve({
                        result: true
                    });
                } else {
                    reject({
                        localapi: body.state,
                        nodejs: null
                    });
                }
            });
    });
}

/* [API] Import Feature Data
 * [Function Input]
 * @param {object} importFile
 * [Promise Resolve]
 * @object {boolean} result
 * [Promise Reject]
 * @object {string} localapi
 * @object {string} nodejs
 */
localapi.prototype.importFeatureFile = function(importFile) {
    var self = this;
    return new Promise(function(resolve, reject) {

        if (typeof(importFile) != 'object') {
            reject(RESPONSE_TYPE_ERROR);
        }

        var data = {
            import_file: importFile
        }

        needle.post('http://' + self.server.host + ':' + self.server.port + TCIT_API_EXCHANGE_IMPORT, data, {
            multipart: true
        }, function(err, resp, body) {
            if (err) {
                reject(err);
            } else if (body.state == TCIT_STATE_SUCCESSFUL) {
                resolve({
                    result: true
                });
            } else {
                reject({
                    localapi: body.state,
                    nodejs: null
                });
            }
        });
    });
}

module.exports = localapi;
