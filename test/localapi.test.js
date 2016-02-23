var expect = require('chai').expect;
var fs = require("fs");

describe('Test API of TCIT LocalAPI SDK', function() {
    var TCITLocalApi = require('../index.js');
    it('load', function() {

    });

    before(function() {
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
});
