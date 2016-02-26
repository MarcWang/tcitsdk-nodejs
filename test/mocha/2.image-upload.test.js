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

describe('Test Image Upload API of TCIT LocalAPI SDK', function() {
    var TCITLocalApi = require(__dirname + '/../../index.js');
    var localapiController = null;
    var buffer = null;
    var path = null;
    // it('load', function() {});

    before(function() {
        buffer = fs.readFileSync(__dirname + '/../../image/lena.jpg');
        path = __dirname + '/../../image/lena.jpg';
        var cfgSetting = readFile(__dirname + '/config.json');
        var host = cfgSetting.server.host;
        var port = parseInt(cfgSetting.server.port, 10);
        localapiController = new TCITLocalApi();
        localapiController.setServerInfo(host, port, 4662);
    });
    after(function() {});

    describe('API.imageBufferUpload', function() {
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

        it('should be return error when no input value ', function() {
            var result = localapiController.imageBufferUpload();
            return result.then(function(res) {
                assert.fail();
            }, function(err) {
                expect(err).to.have.a.property('nodejs');
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

        it('should be return error when no input value ', function() {
            var result = localapiController.imagePathUpload();
            return result.then(function(res) {
                assert.fail();
            }, function(err) {
                expect(err).to.have.a.property('nodejs');
            });
        });
    });
});
