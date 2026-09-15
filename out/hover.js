"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLink = createLink;
exports.buildHoverText = buildHoverText;
const radixRegistry_1 = require("./radixRegistry");
function createLink(text, newText, documentUri, wordRange) {
    const args = {
        uri: documentUri.toString(),
        startLine: wordRange.start.line,
        startChar: wordRange.start.character,
        endLine: wordRange.end.line,
        endChar: wordRange.end.character,
        newText: newText,
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
        lines.push(`| ${system.label} | ${(0, radixRegistry_1.formatInSystem)(system, num)} |`);
    }
    lines.push('');
    lines.push('Заменить на:');
    let row = '| Заменить на |';
    for (const system of registry.list()) {
        if (String(system.base) === num.base)
            continue;
        row += ` ${createLink(system.label, (0, radixRegistry_1.formatInSystem)(system, num), documentUri, wordRange)} |`;
    }
    lines.push(row);
    return lines.join('\n');
}
