"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const commands_1 = require("./commands");
const numberLiteral_1 = require("./numberLiteral");
const hover_1 = require("./hover");
const radixRegistry_1 = require("./radixRegistry");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('radixHover.replaceLiteral', commands_1.replaceLiteral));
    context.subscriptions.push(vscode.commands.registerCommand('radixHover.replaceComment', commands_1.replaceComment));
    const registry = (0, radixRegistry_1.createDefaultRegistry)();
    context.subscriptions.push(vscode.commands.registerCommand('radixHover.addBase', () => (0, commands_1.addBase)(registry)));
    context.subscriptions.push(vscode.commands.registerCommand('radixHover.removeBase', () => (0, commands_1.removeBase)(registry)));
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
            const line = document.lineAt(position.line).text;
            const num = (0, numberLiteral_1.resolveConvertationNumber)(word, line, wordRange.end.character);
            const md = new vscode.MarkdownString((0, hover_1.buildHoverText)(num, word, document.uri, wordRange, registry));
            md.isTrusted = true;
            return new vscode.Hover(md);
        }
    });
    context.subscriptions.push(hoverProvider);
}
function deactivate() { }
