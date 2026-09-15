"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceLiteral = replaceLiteral;
exports.addBase = addBase;
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
async function addBase(registry) {
    const input = await vscode.window.showInputBox({
        title: 'Add new radix',
        prompt: 'Enter the bradix (from 2 to 36).',
        validateInput: (value) => {
            const num = Number(value);
            if (!Number.isInteger(num) || num < 2 || num > 36) {
                return 'Incorrect radix';
            }
            return null;
        }
    });
    if (!input) {
        return;
    }
    const base = Number(input);
    registry.add({ base, label: `BASE-${base}`, prefix: '' });
    vscode.window.showInformationMessage(`Radix added succesfully`);
}
