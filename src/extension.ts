import * as vscode from 'vscode'
import { replaceLiteral, addBase } from './commands';
import { checkNumber, parseNumber, ConvertationNumber } from './numberLiteral';
import { buildHoverText } from './hover';
import { createDefaultRegistry } from './radixRegistry';
/*
 * Точка входа расширения.
 * Регистрирует тестовую команду, команду замены литерала и провайдер
 * hover, работающий в файлах любого языка.
 */
export function activate(context: vscode.ExtensionContext): void {
    const disposable = vscode.commands.registerCommand('radixHover.hello', () => {
        vscode.window.showInformationMessage('Hello');
    });
    context.subscriptions.push(disposable);

    context.subscriptions.push(
        vscode.commands.registerCommand('radixHover.replaceLiteral', replaceLiteral)
    );

    const registry = createDefaultRegistry();
    context.subscriptions.push(
        vscode.commands.registerCommand('radixHover.addBase', () => addBase(registry))
    );

    const hoverProvider = vscode.languages.registerHoverProvider(
        { scheme: '*', language: '*' },
        {
            provideHover(document, position) {
                const wordRange = document.getWordRangeAtPosition(position);
                if (wordRange) {
                    const word = document.getText(wordRange);
                    if (checkNumber(word)) {
                        const md = new vscode.MarkdownString(buildHoverText(parseNumber(word), word, document.uri, wordRange))
                        md.isTrusted = true;
                        return new vscode.Hover(md)
                    }
                }
            }
        }
    )

    context.subscriptions.push(hoverProvider);
}

export function deactivate(): void {}