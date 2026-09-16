import * as vscode from 'vscode'
import { replaceLiteral, addBase, replaceComment, removeBase } from './commands';
import { checkNumber, resolveConvertationNumber } from './numberLiteral';
import { buildHoverText } from './hover';
import { createDefaultRegistry } from './radixRegistry';

export function activate(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand('radixHover.replaceLiteral', replaceLiteral)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('radixHover.replaceComment', replaceComment)
    );

    const registry = createDefaultRegistry();
    context.subscriptions.push(
        vscode.commands.registerCommand('radixHover.addBase', () => addBase(registry))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('radixHover.removeBase', () => removeBase(registry))
    );

    const hoverProvider = vscode.languages.registerHoverProvider(
        { scheme: '*', language: '*' },
        {
            provideHover(document, position) {
                const wordRange = document.getWordRangeAtPosition(position);
                if (!wordRange) {
                    return;
                }

                const word = document.getText(wordRange);
                if (!checkNumber(word)) {
                    return;
                }

                const line = document.lineAt(position.line).text;
                const num = resolveConvertationNumber(word, line, wordRange.end.character);

                const md = new vscode.MarkdownString(
                    buildHoverText(num, word, document.uri, wordRange, registry)
                );
                md.isTrusted = true;
                return new vscode.Hover(md);
            }
        }
    )

    context.subscriptions.push(hoverProvider);
}

export function deactivate(): void {}