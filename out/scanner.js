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
    // Делаем редактор с этим документом активным — editor.action.showHover
    // работает только для активного редактора.
    const editor = await vscode.window.showTextDocument(uri, { preserveFocus: false });
    // Текст заменился, длина могла измениться ("42" → "0x2A"),
    // поэтому старый range.end уже не годится — считаем новый конец
    // от начала диапазона плюс длина нового текста.
    const newEnd = range.start.translate(0, args.newText.length);
    // Ставим курсор на заменённое число — именно в этой позиции
    // потом попросим VS Code показать hover заново.
    editor.selection = new vscode.Selection(range.start, newEnd);
    editor.revealRange(new vscode.Range(range.start, newEnd));
    // Заново вызывает provideHover в текущей позиции курсора
    // и показывает подсказку — уже с обновлённым документом.
    await vscode.commands.executeCommand('editor.action.showHover');
}
