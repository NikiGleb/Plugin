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
    radixComment: number | null;
}

const RADIX_COMMENT_PATTERN = /\/\/\s*radix\s*:\s*\d+/i;

export interface ReplaceCommentArgs {
    uri: string;
    line: number;
    afterChar: number;
    radixComment: number | null;
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

    const newEndChar = args.startChar + args.newText.length;

    await vscode.commands.executeCommand('radixHover.replaceComment', {
        uri: args.uri,
        line: args.startLine,
        afterChar: newEndChar,
        radixComment: args.radixComment,
    } as ReplaceCommentArgs);

    const editor = await vscode.window.showTextDocument(uri, { preserveFocus: false });
    const position = range.start.translate(0, 1);
    editor.selection = new vscode.Selection(position, position);

    await vscode.commands.executeCommand('editor.action.hideHover');
    await vscode.commands.executeCommand('editor.action.showHover');
}

export async function replaceComment(args: ReplaceCommentArgs) {
    const uri = vscode.Uri.parse(args.uri);
    const document = await vscode.workspace.openTextDocument(uri);

    const radixComment = args.radixComment ?? null;

    const lineText = document.lineAt(args.line).text;
    const restOfLine = lineText.slice(args.afterChar);
    const match = RADIX_COMMENT_PATTERN.exec(restOfLine);
    const endOfLine = new vscode.Position(args.line, lineText.length);

    const edit = new vscode.WorkspaceEdit();

    if (match) {
        const commentStart = args.afterChar + match.index;
        const commentRange = new vscode.Range(new vscode.Position(args.line, commentStart), endOfLine);
        edit.replace(uri, commentRange, radixComment === null ? '' : `// radix: ${radixComment}`);
    } 
    else if (radixComment !== null) {
        edit.insert(uri, endOfLine, ` // radix: ${radixComment}`);
    } 
    else {
        return;
    }

    await vscode.workspace.applyEdit(edit);
}

export async function addBase(registry: RadixRegistry){
    const input = await vscode.window.showInputBox({
        title: 'Add new radix',
        prompt: 'Enter the radix (from 2 to 36).',
        validateInput: (value) => {
            const num = Number(value)

            if (registry.has(num)){
                return 'This radix already exists'
            }
            
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