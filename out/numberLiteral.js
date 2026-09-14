"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNumber = checkNumber;
exports.formatNumber = formatNumber;
exports.parseNumber = parseNumber;
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
/*
 * Переводит число во все поддерживаемые системы счисления.
 */
function parseNumber(num) {
    const value = BigInt(num);
    return {
        bin: '0b' + value.toString(2),
        oct: '0o' + value.toString(8),
        dec: value.toString(10),
        hex: '0x' + value.toString(16),
        base: formatNumber(num),
    };
}
