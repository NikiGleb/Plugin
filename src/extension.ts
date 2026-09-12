import * as vscode from 'vscode'
import { checkNumber, formatNumber } from './scanner';

export function activate(context: vscode.ExtensionContext): void {
    const disposable = vscode.commands.registerCommand('radixHover.hello',() => {
        vscode.window.showInformationMessage('Hello1');
    });
    context.subscriptions.push(disposable);

    const hoverProvider = vscode.languages.registerHoverProvider(
        { scheme: '*', language: '*'},
        {
            provideHover(document, position){
                const wordRange = document.getWordRangeAtPosition(position);
                if(wordRange){
                    const word = document.getText(wordRange);
                    if(checkNumber(word)){
                        return new vscode.Hover(formatNumber(word))
                    }
                }
            }
        }
    )
}

export function deactivate(): void {}