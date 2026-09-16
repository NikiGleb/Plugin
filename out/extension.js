"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const commands_1 = require("./commands");
const numberLiteral_1 = require("./numberLiteral");
const hover_1 = require("./hover");
const radixRegistry_1 = require("./radixRegistry");
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
    context.subscriptions.push(vscode.commands.registerCommand('radixHover.replaceComment', commands_1.replaceComment));
    const registry = (0, radixRegistry_1.createDefaultRegistry)();
    context.subscriptions.push(vscode.commands.registerCommand('radixHover.addBase', () => (0, commands_1.addBase)(registry)));
    const hoverProvider = vscode.languages.registerHoverProvider({ scheme: '*', language: '*' }, {
        provideHover(document, position) {
            const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) {
                return;
            }
            const word = document.getText(wordRange);
            if (!(0, numberLiteral_1.checkNumber)(word)) {
                return;
            }
            const prefixBase = Number((0, numberLiteral_1.formatNumber)(word));
            let num;
            if (prefixBase !== 10) {
                num = (0, numberLiteral_1.parseNumber)(word);
            }
            else {
                const line = document.lineAt(position.line).text;
                const commentBase = (0, numberLiteral_1.findCommentRadix)(line, wordRange.end.character);
                num = (commentBase !== null && (0, numberLiteral_1.isValidInBase)(word, commentBase))
                    ? (0, numberLiteral_1.parseNumberAs)(word, commentBase)
                    : (0, numberLiteral_1.parseNumber)(word);
            }
            const md = new vscode.MarkdownString((0, hover_1.buildHoverText)(num, word, document.uri, wordRange, registry));
            md.isTrusted = true;
            return new vscode.Hover(md);
        }
    });
    context.subscriptions.push(hoverProvider);
}
function deactivate() { }
