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
    const editor = await vscode.window.showTextDocument(uri, { preserveFocus: false });
    const position = range.start.translate(0, 1);
    editor.selection = new vscode.Selection(position, position);
    await vscode.commands.executeCommand('editor.action.hideHover');
    await vscode.commands.executeCommand('editor.action.showHover');
}
