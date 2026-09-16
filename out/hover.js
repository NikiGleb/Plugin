"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLink = createLink;
exports.buildHoverText = buildHoverText;
const radixRegistry_1 = require("./radixRegistry");
function createLink(text, newText, documentUri, wordRange, radixComment) {
    const args = {
        uri: documentUri.toString(),
        startLine: wordRange.start.line,
        startChar: wordRange.start.character,
        endLine: wordRange.end.line,
        endChar: wordRange.end.character,
        newText: newText,
        radixComment,
    };
    const encoded = encodeURIComponent(JSON.stringify([args]));
    return `[${text}](command:radixHover.replaceLiteral?${encoded})`;
}
function buildHoverText(num, word, documentUri, wordRange, registry) {
    const lines = [];
    lines.push(`**${word}** — число в системе с основанием ${num.base}`);
    lines.push('');
    lines.push('| Система | Значение |');
    lines.push('|---|---|');
    for (const system of registry.list()) {
        const value = (0, radixRegistry_1.formatInSystem)(system, num);
        const needsComment = system.prefix === '' && system.base !== 10;
        const radixComment = needsComment ? system.base : null;
        lines.push(`| ${createLink(system.label, value, documentUri, wordRange, radixComment)} | ${value} |`);
    }
    return lines.join('\n');
}
