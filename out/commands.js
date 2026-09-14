"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceLiteral = replaceLiteral;
const vscode = require("vscode");
/**
 * Заменяет литерал в документе на новую запись и обновляет hover.
 */
async function replaceLiteral(args) {
    const uri = vscode.Uri.parse(args.uri);
    const range = new vscode.Range(new vscode.Position(args.startLine, args.startChar), new vscode.Position(args.endLine, args.endChar));
    const edit = new vscode.WorkspaceEdit();
    edit.replace(uri, range, args.newText);
    await vscode.workspace.applyEdit(edit);
    await vscode.commands.executeCommand('editor.action.hideHover');
    await vscode.commands.executeCommand('editor.action.showHover');
}
