var expect = require('chai').expect;
var assert = require('chai').assert;
var fs = require("fs");

describe('Test API of TCIT LocalAPI SDK', function() {
    var TCITLocalApi = require('../index.js');
    var buffer = null;
    var path = '../image/lena.jpg'
    it('load', function() {
    });

    before(function() {
        buffer = fs.readFileSync('../image/lena.jpg');
    });
    after(function() {
    });

    describe('API.imageBufferUpload', function() {
        var localapiController = new TCITLocalApi();

        it('should be return img_id when input buffer of image', function() {
            var result = localapiController.imageBufferUpload(buffer);
            return result.then(function(res) {
                expect(res).to.have.a.property('img_id');
            }, function(err) {
                assert.fail(err);
            });
        });

        it('should be a string for img_id type', function() {
            var result = localapiController.imageBufferUpload(buffer);
            return result.then(function(res) {
                expect(res.img_id).to.have.a('string');
            }, function(err) {
                assert.fail(err);
            });
        });
    });

    describe('API.imagePathUpload', function() {
        var localapiController = new TCITLocalApi();

        it('should be return img_id when input file path', function() {
            var result = localapiController.imagePathUpload(path);
            return result.then(function(res) {
                expect(res).to.have.a.property('img_id');
            }, function(err) {
                assert.fail(err);
            });
        });

        it('should be a string for img_id type', function() {
            var result = localapiController.imagePathUpload(path);
            return result.then(function(res) {
                expect(res.img_id).to.have.a('string');
            }, function(err) {
                assert.fail(err);
            });
        });
    });
});
