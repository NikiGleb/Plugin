import * as vscode from 'vscode'
import { replaceLiteral, addBase, replaceComment } from './commands';
import { checkNumber, parseNumber, ConvertationNumber, parseNumberAs, isValidInBase, findCommentRadix, formatNumber } from './numberLiteral';
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

    context.subscriptions.push(
        vscode.commands.registerCommand('radixHover.replaceComment', replaceComment)
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
                if(!wordRange){
                    return
                }
            
                const word = document.getText(wordRange);
                if(!checkNumber(word)){
                    return
                }

                const prefixBase = Number(formatNumber(word));
                let num: ConvertationNumber;

                if (prefixBase !== 10) {
                    num = parseNumber(word);
                } 
                else {
                    const line = document.lineAt(position.line).text;
                    const commentBase = findCommentRadix(line, wordRange.end.character);

                    num = (commentBase !== null && isValidInBase(word, commentBase))
                        ? parseNumberAs(word, commentBase)
                        : parseNumber(word);
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

export function deactivate(): void {}