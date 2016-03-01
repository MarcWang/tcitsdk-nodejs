var expect = require('chai').expect;
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

describe('Test Setting API of TCIT LocalAPI SDK', function() {
    var TCITLocalApi = require(__dirname + '/../index.js');
    var cfgSetting = null,
        host = null,
        port = null;
    // it('load', function() {});

    before(function() {
        cfgSetting = readFile(__dirname + '/config.json');
        host = cfgSetting.server.host;
        port = parseInt(cfgSetting.server.port, 10);
    });
    after(function() {});

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
            expect(localapiController.setServerInfo(host, port, 4662)).to.be.equal(true);
        });
        it('should be return false when set port and wsport with non-number type,', function() {
            expect(localapiController.setServerInfo('localhost', "8800", "4662")).to.be.equal(false);
        });
    });
});
