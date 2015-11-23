/**
 * @file Is file exists ?
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

let fs = require('fs');

module.exports = function (file) {
    let res = true;
    try {
        fs.accessSync(file);
    }
    catch (e) {
        res = false;
    }
    return res;
};
