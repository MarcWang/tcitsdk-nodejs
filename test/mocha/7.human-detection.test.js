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

describe('Test Human Detection API of TCIT LocalAPI SDK', function() {
    var TCITLocalApi = require(__dirname + '/../../index.js');
    var localapiController = null;
    var imgId = null;
    var base64Img = null;
    // it('load', function() {});

    before(function() {
        var buffer = fs.readFileSync(__dirname + '/../../image/lena.jpg');
        var cfgSetting = readFile(__dirname + '/config.json');
        var host = cfgSetting.server.host;
        var port = parseInt(cfgSetting.server.port, 10);
        localapiController = new TCITLocalApi();
        localapiController.setServerInfo(host, port, 4662);

        base64Img = buffer.toString('base64');
        var result = localapiController.imageBufferUpload(buffer);
        return result.then(function(res) {
            imgId = res.img_id;
        }, function(err) {
            assert.fail(err);
        });
    });
    after(function() {});

    describe('API.humanDetect on non-tracking', function() {
        it('should be return humans when input img_id', function() {
            var result = localapiController.humanDetect(imgId, null, null);
            return result.then(function(res) {
                expect(res).to.have.a.property('humans');
            }, function(err) {
                assert.fail(err);
            });
        });

        it('should be return humans when input base64 of image', function() {
            var result = localapiController.humanDetect(null, base64Img, null);
            return result.then(function(res) {
                expect(res).to.have.a.property('humans');
            }, function(err) {
                assert.fail(err);
            });
        });

        it('should be return error when no input value', function() {
            var result = localapiController.humanDetect();
            return result.then(function(res) {
                assert.fail();
            }, function(err) {
                expect(err).to.have.a.property('nodejs');
            });
        });
    });

    describe('API.humanDetect on tracking', function() {
        var trackId = null;
        it('should be return treck_id when call createHumanTrack()', function() {
            var result = localapiController.createHumanTrack();
            return result.then(function(res) {
                trackId = res.treck_id;
                expect(res).to.have.a.property('treck_id');
            }, function(err) {
                assert.fail(err);
            });
        });

        it('should be return humans when input base64 of image on tracking mode', function() {
            var result = localapiController.humanDetect(null, base64Img, trackId);
            return result.then(function(res) {
                expect(res).to.have.a.property('humans');
            }, function(err) {
                assert.fail(err);
            });
        });

        it('should be return result when call deleteHumanTrack()', function() {
            var result = localapiController.deleteHumanTrack(trackId);
            return result.then(function(res) {
                expect(res).to.have.a.property('result');
                expect(res.result).to.be.true;
            }, function(err) {
                assert.fail(err);
            });
        });
    });
});