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

describe('Test Face Compare of TCIT LocalAPI SDK', function() {
    var TCITLocalApi = require(__dirname + '/../../index.js');
    var localapiController = null;
    var faceId1 = null;
    var faceId2 = null;

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
            }, function(err) {
                assert.fail(err);
            });
        }, function(err) {
            assert.fail(err);
        });
    });
    after(function() {});

    describe('API.faceCompare', function() {
        it('should be return similarity', function() {
            var result = localapiController.faceCompare(faceId1, faceId2);
            return result.then(function(res) {
                expect(res).to.have.a.property('similarity');
            }, function(err) {
                assert.fail(err);
            });
        });

        it('should be return error when no input value', function() {
            var result = localapiController.faceCompare(222);
            return result.then(function(res) {
                assert.fail();
            }, function(err) {
                expect(err).to.have.a.property('nodejs');
            });
        });
    });
});
