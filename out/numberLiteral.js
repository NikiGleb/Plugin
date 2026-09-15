"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNumber = checkNumber;
exports.formatNumber = formatNumber;
exports.getDigitsBody = getDigitsBody;
exports.parseNumber = parseNumber;
exports.toRadix = toRadix;
/*
 * Проверяет, является ли слово корректным числовым литералом.
 * Допустимые формы: двоичная, восьмеричная, шестнадцатеричная и десятичная.
 */
function checkNumber(word) {
    const pattern = /^(0[bB][01]+|0[oO][0-7]+|0[xX][0-9a-fA-F]+|[0-9]+)$/;
    return pattern.test(word);
}
/*
 * Определяет систему счисления литерала по его префиксу.
 * Вызывается только для строк, уже прошедших проверку checkNumber.
 */
function formatNumber(line) {
    if (line[0] === '0' && line[1] === 'b') {
        return "2";
    }
    if (line[0] === '0' && line[1] === 'o') {
        return "8";
    }
    if (line[0] === '0' && line[1] === 'x') {
        return "16";
    }
    return "10";
}
function getDigitsBody(word) {
    const base = formatNumber(word);
    const body = base === '10' ? word : word.slice(2);
    return body.toLowerCase();
}
function parseNumber(num) {
    return {
        digits: getDigitsBody(num),
        base: formatNumber(num),
    };
}
const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';
function getId(symb) {
    let id = 0;
    while (DIGITS[id] !== symb) {
        id++;
    }
    return id;
}
function toRadix(startNum, startBase, endBase) {
    let num10 = 0;
    let endNum = '';
    for (const symb of startNum) {
        num10 = num10 * Number(startBase) + getId(symb);
    }
    while (num10 > 0) {
        const rest = num10 % Number(endBase);
        endNum += DIGITS[rest];
        num10 = Math.floor(num10 / Number(endBase));
    }
    return endNum.split('').reverse().join('');
}
