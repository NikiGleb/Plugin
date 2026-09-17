"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceLiteral = replaceLiteral;
exports.replaceComment = replaceComment;
exports.addBase = addBase;
exports.removeBase = removeBase;
const vscode = require("vscode");
/**
 * Заменяет литерал в документе на новую запись, поручает обновление
 * комментария replaceComment, затем переоткрывает hover.
 */
async function replaceLiteral(args) {
    const uri = vscode.Uri.parse(args.uri);
    const range = new vscode.Range(new vscode.Position(args.startLine, args.startChar), new vscode.Position(args.endLine, args.endChar));
    const edit = new vscode.WorkspaceEdit();
    edit.replace(uri, range, args.newText);
    await vscode.workspace.applyEdit(edit);
    // Литерал мог сменить длину — пересчитываем позицию "конец литерала".
    const newEndChar = args.startChar + args.newText.length;
    await vscode.commands.executeCommand('radixHover.replaceComment', {
        uri: args.uri,
        line: args.startLine,
        afterChar: newEndChar,
        radixComment: args.radixComment,
    });
    const editor = await vscode.window.showTextDocument(uri, { preserveFocus: false });
    const position = range.start.translate(0, 1);
    editor.selection = new vscode.Selection(position, position);
    await vscode.commands.executeCommand('editor.action.hideHover');
    await vscode.commands.executeCommand('editor.action.showHover');
}
/* Регулярка для поиска комментария // radix: N в остатке строки после литерала. */
const RADIX_COMMENT_PATTERN = /\/\/\s*radix\s*:\s*\d+/i;
/*
 * Добавляет, обновляет или удаляет комментарий // radix: N справа от числа
 * на той же строке.
 */
async function replaceComment(args) {
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
/* Подставляет подпись для стандартных систем счисления. */
function labelForNewBase(base) {
    if (base === 2) {
        return `BIN`;
    }
    if (base === 8) {
        return `OCT`;
    }
    if (base === 10) {
        return `DEC`;
    }
    if (base === 16) {
        return `HEX`;
    }
    return `BASE-${base}`;
}
/* Плажка для добавления новой системы счисления в реестр. */
async function addBase(registry) {
    const input = await vscode.window.showInputBox({
        title: 'Add new radix',
        prompt: 'Enter the radix (from 2 to 36).',
        validateInput: (value) => {
            const num = Number(value);
            if (registry.has(num)) {
                return 'This radix already exists';
            }
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
    const label = labelForNewBase(base);
    registry.add({ base, label: label, prefix: '' });
    vscode.window.showInformationMessage(`Radix added successfully`);
}
/* Плажка для удаления системы счисления из реестра. */
async function removeBase(registry) {
    const picked = await vscode.window.showInputBox({
        title: 'Remove radix',
        prompt: 'Enter the radix',
        validateInput: (value) => {
            const num = Number(value);
            if (!registry.has(num)) {
                return 'This radix does not exist';
            }
            if (!Number.isInteger(num) || num < 2 || num > 36) {
                return 'Incorrect radix';
            }
            return null;
        }
    });
    if (!picked) {
        return;
    }
    registry.remove(Number(picked));
}
