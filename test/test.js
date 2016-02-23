var expect = require('chai').expect;
var assert = require('chai').assert;
var fs = require("fs");

describe('Test API of TCIT LocalAPI SDK', function() {
    var TCITLocalApi = require('../index.js');
    var buffer = null;
    it('load', function() {

    });

    before(function() {
        // 任何需要在測試前執行的程式
        buffer = fs.readFileSync('../image/lena.jpg');
    });
    after(function() {
        // 任何需要在測試後刪除的資料
    });

    describe('API.getVersion', function() {
        var localapiController = new TCITLocalApi();
        it('should be return string', function() {
            expect(localapiController.getVersion()).to.be.a('string');
        });
    });

    describe('API.setServerInfo', function() {
        var localapiController = new TCITLocalApi();
        it('should be return false when no value input, ', function() {
            expect(localapiController.setServerInfo()).to.be.equal(false);
        });
        it('should be return true when set host, port and wsport,', function() {
            expect(localapiController.setServerInfo('localhost', 8800, 4662)).to.be.equal(true);
        });
        it('should be return false when set port and wsport with non-number type,', function() {
            expect(localapiController.setServerInfo('localhost', "8800", "4662")).to.be.equal(false);
        });
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
});
