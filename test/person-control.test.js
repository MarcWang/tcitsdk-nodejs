var expect = require('chai').expect;
var assert = require('chai').assert;
var fs = require("fs");

describe('Test Face Compare of TCIT LocalAPI SDK', function() {
    var TCITLocalApi = require('../index.js');
    var localapiController = new TCITLocalApi();
    var base64Img1 = null;
    var base64Img2 = null;
    var faceId1 = null;
    var faceId2 = null;
    var personId = null;

    it('load', function() {});

    before(function() {
        var buffer1 = fs.readFileSync('../image/lena.jpg');
        var buffer2 = fs.readFileSync('../image/ann.jpg');
        base64Img1 = buffer1.toString('base64');
        base64Img2 = buffer2.toString('base64');

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
