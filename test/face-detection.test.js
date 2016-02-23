var expect = require('chai').expect;
var assert = require('chai').assert;
var fs = require("fs");

describe('Test API of TCIT LocalAPI SDK', function() {
    var TCITLocalApi = require('../index.js');
    var localapiController = new TCITLocalApi();
    var buffer = null;
    var imgId = null;
    var base64Img = null;
    var path = '../image/lena.jpg'
    it('load', function() {});

    before(function() {
        buffer = fs.readFileSync('../image/lena.jpg');
        base64Img = buffer.toString('base64');
        var result = localapiController.imageBufferUpload(buffer);
        return result.then(function(res) {
            imgId = res.img_id;
        }, function(err) {
            assert.fail(err);
        });
    });
    after(function() {});

    describe('API.faceDetect on non-tracking', function() {
        it('should be return faces when input img_id', function() {
            var result = localapiController.faceDetect(imgId,null,null);
            return result.then(function(res) {
                expect(res).to.have.a.property('faces');
            }, function(err) {
                assert.fail(err);
            });
        });

        it('should be return faces when input base64 of image', function() {
            var result = localapiController.faceDetect(null,base64Img,null);
            return result.then(function(res) {
                expect(res).to.have.a.property('faces');
            }, function(err) {
                assert.fail(err);
            });
        });

        it('should be return error when no input value', function() {
            var result = localapiController.faceDetect();
            return result.then(function(res) {
                assert.fail();
            }, function(err) {
                expect(err).to.have.a.property('nodejs');
            });
        });
    });

    describe('API.faceDetect on tracking', function() {
        var trackId = null;
        it('should be return treck_id when call createFaceTrack()', function() {
            var result = localapiController.createFaceTrack();
            return result.then(function(res) {
                trackId = res.treck_id;
                expect(res).to.have.a.property('treck_id');
            }, function(err) {
                assert.fail(err);
            });
        });

        it('should be return faces when input base64 of image on tracking mode', function() {
            var result = localapiController.faceDetect(null,base64Img,trackId);
            return result.then(function(res) {
                expect(res).to.have.a.property('faces');
            }, function(err) {
                assert.fail(err);
            });
        });

        it('should be return result when call deleteFaceTrack()', function() {
            var result = localapiController.deleteFaceTrack(trackId);
            return result.then(function(res) {
                expect(res).to.have.a.property('result');
                expect(res.result).to.be.true;
            }, function(err) {
                assert.fail(err);
            });
        });
    });
});
