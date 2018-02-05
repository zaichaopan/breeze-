const fs = require('fs');
const path = require('path');

exports.clearDisk = path => {
    if (!fs.existsSync(path)) {
        return;
    }

    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index) {
            var curPath = path + '/' + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });

        fs.rmdirSync(path);
    }
};

exports.fileExists = path => fs.existsSync(path);
