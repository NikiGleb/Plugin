"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildHoverText = buildHoverText;
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const scanner_1 = require("./scanner");
function buildHoverText(num, word) {
    const lines = [];
    lines.push(`**${word}** — число в системе с основанием ${num.base}`);
    lines.push('');
    lines.push('| Система | Значение |');
    lines.push('|---|---|');
    lines.push(`| bin | ${num.bin} |`);
    lines.push(`| oct | ${num.oct} |`);
    lines.push(`| dec | ${num.dec} |`);
    lines.push(`| hex | ${num.hex} |`);
    return lines.join('\n');
}
function activate(context) {
    const disposable = vscode.commands.registerCommand('radixHover.hello', () => {
        vscode.window.showInformationMessage('Hello1');
    });
    context.subscriptions.push(disposable);
    const hoverProvider = vscode.languages.registerHoverProvider({ scheme: '*', language: '*' }, {
        provideHover(document, position) {
            const wordRange = document.getWordRangeAtPosition(position);
            if (wordRange) {
                const word = document.getText(wordRange);
                if ((0, scanner_1.checkNumber)(word)) {
                    const md = new vscode.MarkdownString(buildHoverText((0, scanner_1.parseNumber)(word), word));
                    return new vscode.Hover(md);
                }
            }
        }
    });
}
function deactivate() { }
