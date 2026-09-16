import * as vscode from 'vscode'
import { replaceLiteral, addBase, replaceComment, removeBase } from './commands';
import { resolveConvertationNumber } from './numberLiteral';
import { buildHoverText } from './hover';
import { createDefaultRegistry } from './radixRegistry';

/*
 * Точка входа расширения.
 * Регистрирует команды замены литерала/комментария, добавления/удаления
 * систем счисления и провайдер hover, работающий в файлах любого языка.
 */
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
                const line = document.lineAt(position.line).text;
                const num = resolveConvertationNumber(word, line, wordRange.end.character);
                if (!num) {
                    return;
                }

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

/* Вызывается VS Code при выгрузке расширения */
export function deactivate(): void {}