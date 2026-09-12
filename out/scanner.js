"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNumbers = findNumbers;
exports.numberAt = numberAt;
function findNumbers(line) {
    const result = [];
    const pattern = /\d+/g;
    let match;
    while ((match = pattern.exec(line)) !== null) {
        result.push({
            start: match.index,
            end: match.index + match[0].length,
            text: match[0]
        });
    }
    return result;
}
function numberAt(line, character) {
    for (const n of findNumbers(line)) {
        if (character >= n.start && character < n.end) {
            return n;
        }
    }
    return null;
}
