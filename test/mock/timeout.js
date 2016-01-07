/**
 * @file timeout
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

let time = process.argv[2] || '0';

time = parseInt(time, 10);

setTimeout(
    () => {
        console.log('finish');
    },
    time
);
