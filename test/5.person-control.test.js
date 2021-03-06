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

describe('Test Person Control of TCIT LocalAPI SDK', function() {
    var TCITLocalApi = require(__dirname + '/../index.js');
    var localapiController = null;
    var faceId1 = null;
    var faceId2 = null;
    var personId = null;
    var imgBuffer = null;

    // it('load', function() {});

    before(function() {
        var cfgSetting = readFile(__dirname + '/config.json');
        var host = cfgSetting.server.host;
        var port = parseInt(cfgSetting.server.port, 10);
        localapiController = new TCITLocalApi();
        localapiController.setServerInfo(host, port, 4662);

        imgBuffer = fs.readFileSync(__dirname + '/../image/patty.jpg');
        var buffer1 = fs.readFileSync(__dirname + '/../image/lena.jpg');
        var buffer2 = fs.readFileSync(__dirname + '/../image/ann.jpg');
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
            }, function(err) {
                assert.fail(err);
            });
        }, function(err) {
            assert.fail(err);
        });
    });
    after(function() {});

    describe('API.createPerson', function() {
        it('should be return object, include key person_id, added_face_count and added_group_count', function() {
            var result = localapiController.createPerson(faceId1, null, null);
            return result.then(function(res) {
                personId = res.person_id;
                expect(res).to.have.all.keys('person_id', 'added_face_count', 'added_group_count');
            }, function(err) {
                assert.fail(err);
            });
        });
    });

    describe('API.addFaceToPerson', function() {
        it('should be return object include added_face_count = 1 ', function() {
            var result = localapiController.addFaceToPerson(personId, faceId2, null);
            return result.then(function(res) {
                expect(res).to.deep.equal({ added_face_count: 1 });
            }, function(err) {
                assert.fail(err);
            });
        });
    });

    describe('API.getPersonInfo', function() {
        it('should be return object include person_id, faces and groups ', function() {
            var result = localapiController.getPersonInfo(personId);
            return result.then(function(res) {
                expect(res).to.have.all.keys('person_id', 'faces', 'groups');
            }, function(err) {
                assert.fail(err);
            });
        });
    });

    describe('API.queryPersonList', function() {
        it('should be return object include persons ', function() {
            var result = localapiController.queryPersonList();
            return result.then(function(res) {
                expect(res).to.have.all.keys('persons');
            }, function(err) {
                assert.fail(err);
            });
        });
    });

    describe('API.personVerify', function() {
        it('should be return object include confidence', function() {
            var result = localapiController.personVerify(personId, faceId2, null);
            return result.then(function(res) {
                expect(res).to.have.all.keys('confidence');
            }, function(err) {
                assert.fail(err);
            });
        });
    });

    describe('API.imagePersonVerify', function() {
        it('should be return object include faces ', function() {
            var result = localapiController.imagePersonVerify(imgBuffer, personId);
            return result.then(function(res) {
                expect(res).to.have.all.keys('faces');
            }, function(err) {
                assert.fail(err);
            });
        });
    });

    describe('API.removeFaceFromPerson', function() {
        it('should be return object include removed_face_count = 1 ', function() {
            var result = localapiController.removeFaceFromPerson(personId, faceId2);
            return result.then(function(res) {
                expect(res).to.deep.equal({ removed_face_count: 1 });
            }, function(err) {
                assert.fail(err);
            });
        });
    });

    describe('API.deletePerson', function() {
        it('should be return object include delete_count', function() {
            var result = localapiController.deletePerson(personId);
            return result.then(function(res) {
                expect(res).to.have.property('delete_count')
            }, function(err) {
                assert.fail(err);
            });
        });
    });
});
