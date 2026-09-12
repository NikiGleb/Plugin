"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNumber = checkNumber;
exports.formatNumber = formatNumber;
function checkNumber(line) {
    const pattern = /[1-9]+[0-9]*/;
    if (pattern.test(line)) {
        return true;
    }
    else {
        return false;
    }
}
function formatNumber(line) {
    const banSymbols = ['.', ',', 'e'];
    if (banSymbols.some((symbol) => line.includes(symbol))) {
        return "-1";
    }
    if (line[0] === '0' && line[1] === 'b') {
        return "2";
    }
    if (line[0] === '0' && line[1] === 'o') {
        return "8";
    }
    if (line[0] === '0' && line[1] === 'h') {
        return "16";
    }
    return "10";
}
