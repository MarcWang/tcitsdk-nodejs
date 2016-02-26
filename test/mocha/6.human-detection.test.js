// var fs = require("fs"),
//     gm = require('gm');
// var TCITLocalApi = require('../../index.js');
// var localapiController = new TCITLocalApi();
// var srcDir = './image/one/';
// var dstDir = './tmp/'

// mkdirSync(dstDir);

// var fileList = []
// fs.readdirSync(srcDir).forEach(function(file) {
//     fileList.push(file);
// });
// var idx = 0;
// var length = fileList.length;

// function humanDetection(path) {
//     var bufferImg = fs.readFileSync(srcDir + path);
//     var base64Img = bufferImg.toString('base64');
//     localapiController.humanDetect(null, base64Img, null).then(function(res) {
//         if (res.humans) {
//             if (res.humans.length > 0) {
//                 var img = gm(bufferImg);
//                 img.stroke("red", 7);
//                 img.fill("#ffffffff");
//                 res.humans.forEach(function(human) {
//                     x0 = human.detectPos[0][0];
//                     y0 = human.detectPos[0][1];
//                     x1 = human.detectPos[2][0];
//                     y1 = human.detectPos[2][1];
//                     img.drawRectangle(x0, y0, x1, y1);
//                 })
//                 img.write(dstDir + path, function(err) {
//                     if (err) console.log(err);
//                 });
//             }
//         } else {
//             console.log(path);
//             fs.writeFileSync(dstDir + path, bufferImg);
//         }

//         idx++;
//         if (length > idx) {
//             humanDetection(fileList[idx]);
//         }

//     }).catch(function(error) {
//         console.log("Test API humanDetect using base64Img Error");
//         console.log(error);
//         idx++;
//         if (length > idx) {
//             humanDetection(fileList[idx]);
//         }
//     });
// }

// if (length > idx) {
//     humanDetection(fileList[idx])
// }


// function mkdirSync(path) {
//     try {
//         fs.mkdirSync(path);
//     } catch (e) {
//         if (e.code != 'EEXIST') {
//             throw e;
//         }
//     }
// }
