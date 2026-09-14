"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLink = createLink;
exports.buildHoverText = buildHoverText;
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const commands_1 = require("./commands");
const numberLiteral_1 = require("./numberLiteral");
/*
 * Строит Markdown-ссылку вида [текст](command:...), которая при клике
 * запускает команду radixHover.replaceLiteral.
 */
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
;
/*
 * Формирует текст hover: таблицу значений во всех системах
 * счисления и строку с кликабельными ссылками на замену.
 */
function buildHoverText(num, word, documentUri, wordRange) {
    const lines = [];
    lines.push(`**${word}** — число в системе с основанием ${num.base}`);
    lines.push('');
    lines.push('| Система | Значение |');
    lines.push('|---|---|');
    lines.push(`| bin | ${num.bin} |`);
    lines.push(`| oct | ${num.oct} |`);
    lines.push(`| dec | ${num.dec} |`);
    lines.push(`| hex | ${num.hex} |`);
    lines.push('');
    lines.push('Заменить на:');
    let toChangeNumSystemLine = '| Заменить на |';
    // Не предлагаем заменить число на запись в той же системе счисления,
    // в которой оно уже записано в коде.
    if (num.base !== '2') {
        toChangeNumSystemLine += ` ${createLink('BIN', num.bin, documentUri, wordRange)} |`;
    }
    if (num.base !== '8') {
        toChangeNumSystemLine += ` ${createLink('OCT', num.oct, documentUri, wordRange)} |`;
    }
    if (num.base !== '10') {
        toChangeNumSystemLine += ` ${createLink('DEC', num.dec, documentUri, wordRange)} |`;
    }
    if (num.base !== '16') {
        toChangeNumSystemLine += ` ${createLink('HEX', num.hex, documentUri, wordRange)} |`;
    }
    lines.push(toChangeNumSystemLine);
    return lines.join('\n');
}
/*
 * Точка входа расширения.
 * Регистрирует тестовую команду, команду замены литерала и провайдер
 * hover, работающий в файлах любого языка.
 */
function activate(context) {
    const disposable = vscode.commands.registerCommand('radixHover.hello', () => {
        vscode.window.showInformationMessage('Hello');
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(vscode.commands.registerCommand('radixHover.replaceLiteral', commands_1.replaceLiteral));
    const hoverProvider = vscode.languages.registerHoverProvider({ scheme: '*', language: '*' }, {
        provideHover(document, position) {
            const wordRange = document.getWordRangeAtPosition(position);
            if (wordRange) {
                const word = document.getText(wordRange);
                if ((0, numberLiteral_1.checkNumber)(word)) {
                    const md = new vscode.MarkdownString(buildHoverText((0, numberLiteral_1.parseNumber)(word), word, document.uri, wordRange));
                    md.isTrusted = true;
                    return new vscode.Hover(md);
                }
            }
        }
    });
    context.subscriptions.push(hoverProvider);
}
function deactivate() { }
