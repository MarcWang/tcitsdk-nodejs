var expect = require('chai').expect;
var assert = require('chai').assert;
var fs = require("fs");

function readFile(file) {
    var data = fs.readFileSync(file);
    try {
        var obj = JSON.parse(data);
        return obj;
    } catch (err) {
        return null;
    }
}

describe('Test Group Control of TCIT LocalAPI SDK', function() {
    var TCITLocalApi = require(__dirname + '/../../index.js');
    var localapiController = null;
    var faceId1 = null;
    var faceId2 = null;
    var personId = null;
    var groupId = null;

    // it('load', function() {});

    before(function() {
        var cfgSetting = readFile(__dirname + '/config.json');
        var host = cfgSetting.server.host;
        var port = parseInt(cfgSetting.server.port, 10);
        localapiController = new TCITLocalApi();
        localapiController.setServerInfo(host, port, 4662);

        var buffer1 = fs.readFileSync(__dirname + '/../../image/lena.jpg');
        var buffer2 = fs.readFileSync(__dirname + '/../../image/ann.jpg');
        var base64Img1 = buffer1.toString('base64');
        var base64Img2 = buffer2.toString('base64');

        var result = localapiController.faceDetect(null, base64Img1, null);
        return result.then(function(res) {
            if (res.faces.length > 0) {
                faceId1 = res.faces[0].face_id;
            }
            var result = localapiController.faceDetect(null, base64Img2, null);
            return result.then(function(res) {
                if (res.faces.length > 0) {
                    faceId2 = res.faces[0].face_id;
                }
                var result = localapiController.createPerson(faceId2, null, null);
                return result.then(function(res) {
                    personId = res.person_id;
                }, function(err) {
                    assert.fail(err);
                });
            }, function(err) {
                assert.fail(err);
            });
        }, function(err) {
            assert.fail(err);
        });
    });
    after(function() {});

    describe('API.createGroup', function() {
        it('should be return object, include key group_id and added_person_count', function() {
            var result = localapiController.createGroup(personId);
            return result.then(function(res) {
                groupId = res.group_id;
                expect(res).to.have.all.keys('group_id', 'added_person_count');
            }, function(err) {
                assert.fail(err);
            });
        });
    });

    
    describe('API.getGroupInfo', function() {
        it('should be return object include group_id and persons ', function() {
            var result = localapiController.getGroupInfo(groupId);
            return result.then(function(res) {
                expect(res).to.have.all.keys('group_id', 'persons');
            }, function(err) {
                assert.fail(err);
            });
        });
    });

    describe('API.queryGroupList', function() {
        it('should be return object include groups ', function() {
            var result = localapiController.queryGroupList();
            return result.then(function(res) {
                expect(res).to.have.all.keys('groups');
            }, function(err) {
                assert.fail(err);
            });
        });
    });

    describe('API.groupIdentify', function() {
        it('should be return object include persons', function() {
            var result = localapiController.groupIdentify(groupId, faceId2, null);
            return result.then(function(res) {
                expect(res).to.have.all.keys('persons');
            }, function(err) {
                assert.fail(err);
            });
        });
    });

    describe('API.removePersonFromGroup', function() {
        it('should be return object include removed_person_count = 1 ', function() {
            var result = localapiController.removePersonFromGroup(groupId, personId);
            return result.then(function(res) {
                expect(res).to.deep.equal({ removed_person_count: 1 });
            }, function(err) {
                assert.fail(err);
            });
        });
    });

    describe('API.addPersonToGroup', function() {
        it('should be return object include added_face_count = 1 ', function() {
            var result = localapiController.addPersonToGroup(groupId, personId);
            return result.then(function(res) {
                expect(res).to.deep.equal({ added_person_count: 1 });
            }, function(err) {
                assert.fail(err);
            });
        });
    });

    describe('API.deleteGroup', function() {
        it('should be return object include delete_count', function() {
            var result = localapiController.deleteGroup(groupId);
            return result.then(function(res) {
                expect(res).to.have.property('delete_count')
            }, function(err) {
                assert.fail(err);
            });
        });
    });
});
