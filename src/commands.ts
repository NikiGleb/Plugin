import * as vscode from 'vscode';
import { RadixRegistry } from './radixRegistry';

/* 
 * Структура для хранения данных, необходимых для изменения литерала.
*/
export interface ReplaceArgs {
    uri: string;
    startLine: number;
    startChar: number;
    endLine: number;
    endChar: number;
    newText: string;
}

/**
 * Заменяет литерал в документе на новую запись и обновляет hover.
 */
export async function replaceLiteral(args: ReplaceArgs) {
    const uri = vscode.Uri.parse(args.uri);
    const range = new vscode.Range(
        new vscode.Position(args.startLine, args.startChar),
        new vscode.Position(args.endLine, args.endChar)
    );

    const edit = new vscode.WorkspaceEdit();
    edit.replace(uri, range, args.newText);
    await vscode.workspace.applyEdit(edit);

    const editor = await vscode.window.showTextDocument(uri, { preserveFocus: false });
    const position = range.start.translate(0, 1);
    editor.selection = new vscode.Selection(position, position);

    await vscode.commands.executeCommand('editor.action.hideHover');
    await vscode.commands.executeCommand('editor.action.showHover');
}

export async function addBase(registry: RadixRegistry){
    const input = await vscode.window.showInputBox({
        title: 'Add new radix',
        prompt: 'Enter the radix (from 2 to 36).',
        validateInput: (value) => {
            const num = Number(value)
            if(!Number.isInteger(num) || num < 2 || num > 36){
                return 'Incorrect radix'
            }
            return null;
        }
    })
    if (!input){
        return;
    }

    const base = Number(input);
    registry.add({base, label: `BASE-${base}`, prefix: ''})
    vscode.window.showInformationMessage(`Radix added succesfully`);
}

