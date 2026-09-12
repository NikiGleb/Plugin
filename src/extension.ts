import * as vscode from 'vscode'
import { checkNumber, formatNumber, parseNumber, ConvertationNumber } from './scanner';

export function buildHoverText(num: ConvertationNumber, word: string){
    const lines: string[] = [];

    lines.push(`**${word}** — число в системе с основанием ${num.base}`);
    lines.push(''); 
    lines.push('| Система | Значение |');
    lines.push('|---|---|');
    lines.push(`| bin | ${num.bin} |`)
    lines.push(`| oct | ${num.oct} |`)
    lines.push(`| dec | ${num.dec} |`)
    lines.push(`| hex | ${num.hex} |`)
    
    return lines.join('\n');
}
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
                        const md = new vscode.MarkdownString(buildHoverText(parseNumber(word), word))
                        return new vscode.Hover(md)
                    }
                }
            }
        }
    )
}

export function deactivate(): void {}