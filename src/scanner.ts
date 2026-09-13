import * as vscode from 'vscode';

export function checkNumber(word: string): boolean {
    const pattern = /^(0[bB][01]+|0[oO][0-7]+|0[xX][0-9a-fA-F]+|[0-9]+)$/;
    return pattern.test(word);
}

export function formatNumber(line: string): string{
    if (line[0] === '0' && line[1] === 'b'){
        return "2"
    }
    if (line[0] === '0' && line[1] === 'o'){
        return "8"
    }
    if (line[0] === '0' && line[1] === 'x'){
        return "16"
    }
    return "10"
}

export interface ConvertationNumber {
    bin: string;
    oct: string;
    dec: string;
    hex: string;
    base: string;
}

export function parseNumber(num: string): ConvertationNumber {
    const value = BigInt(num);

    return {
        bin: '0b'+value.toString(2),
        oct: '0o'+value.toString(8),
        dec: value.toString(10),
        hex: '0x'+value.toString(16),
        base: formatNumber(num),
    };
}

export interface ReplaceArgs {
    uri: string;
    startLine: number;
    startChar: number;
    endLine: number;
    endChar: number;
    newText: string;
}

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
