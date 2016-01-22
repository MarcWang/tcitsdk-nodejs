var TCITLocalApi = require('./index.js');
var fs = require("fs");

var localapiController = new TCITLocalApi();

if (!localapiController.setServerInfo('localhost', 8800)) {
    console.log("Set Server Information Error");
} else {
    console.log("Set Server Information Success"); 
}

process.on('SIGINT', function() {
    process.exit();
});
