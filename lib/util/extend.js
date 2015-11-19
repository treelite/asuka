/**
 * @file extend
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

function cpy(target, source) {
    Object.keys(source).forEach((key) => {
        target[key] = source[key];
    });
}

/**
 * 对象属性拷贝
 *
 * @param {Object} target 目标对象
 * @param {...Object} source 源对象
 * @return {Object}
 */
module.exports = function (target) {
    let source;
    let len = arguments.length;
    for (var i = 1; i < len; i++) {
        source = arguments[i];

        if (!source) {
            continue;
        }

        cpy(target, source);
    }

    return target;
};
