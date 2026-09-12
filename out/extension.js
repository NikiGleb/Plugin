"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const scanner_1 = require("./scanner");
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
                    return new vscode.Hover((0, scanner_1.formatNumber)(word));
                }
            }
        }
    });
}
function deactivate() { }
