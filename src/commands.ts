import * as vscode from 'vscode';

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

    await vscode.commands.executeCommand('editor.action.hideHover');
    await vscode.commands.executeCommand('editor.action.showHover');
}