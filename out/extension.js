"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const commands_1 = require("./commands");
const numberLiteral_1 = require("./numberLiteral");
const hover_1 = require("./hover");
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
                    const md = new vscode.MarkdownString((0, hover_1.buildHoverText)((0, numberLiteral_1.parseNumber)(word), word, document.uri, wordRange));
                    md.isTrusted = true;
                    return new vscode.Hover(md);
                }
            }
        }
    });
    context.subscriptions.push(hoverProvider);
}
function deactivate() { }
