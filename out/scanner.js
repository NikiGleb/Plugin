"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNumber = checkNumber;
exports.formatNumber = formatNumber;
exports.parseNumber = parseNumber;
exports.replaceLiteral = replaceLiteral;
const vscode = require("vscode");
function checkNumber(line) {
    const pattern = /[1-9]+[0-9]*/;
    if (pattern.test(line)) {
        return true;
    }
    else {
        return false;
    }
}
function formatNumber(line) {
    const banSymbols = ['.', ',', 'e'];
    if (banSymbols.some((symbol) => line.includes(symbol))) {
        return "-1";
    }
    if (line[0] === '0' && line[1] === 'b') {
        return "2";
    }
    if (line[0] === '0' && line[1] === 'o') {
        return "8";
    }
    if (line[0] === '0' && line[1] === 'x') {
        return "16";
    }
    return "10";
}
function parseNumber(num) {
    const value = BigInt(num);
    return {
        bin: '0b' + value.toString(2),
        oct: '0o' + value.toString(8),
        dec: value.toString(10),
        hex: '0x' + value.toString(16),
        base: formatNumber(num),
    };
}
async function replaceLiteral(args) {
    const uri = vscode.Uri.parse(args.uri);
    const range = new vscode.Range(new vscode.Position(args.startLine, args.startChar), new vscode.Position(args.endLine, args.endChar));
    const edit = new vscode.WorkspaceEdit();
    edit.replace(uri, range, args.newText);
    await vscode.workspace.applyEdit(edit);
    const editor = await vscode.window.showTextDocument(uri, { preserveFocus: false });
    const position = range.start.translate(0, 1);
    editor.selection = new vscode.Selection(position, position);
    editor.revealRange(range);
    await vscode.commands.executeCommand('editor.action.hideHover');
    await vscode.commands.executeCommand('editor.action.showHover');
}
