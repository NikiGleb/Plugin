import * as vscode from 'vscode';
import { ConvertationNumber } from './numberLiteral';
import { RadixRegistry, formatInSystem } from './radixRegistry';

export function createLink(text: string, newText: string, documentUri: vscode.Uri, wordRange: vscode.Range): string {
    const args = {
        uri: documentUri.toString(),
        startLine: wordRange.start.line,
        startChar: wordRange.start.character,
        endLine: wordRange.end.line,
        endChar: wordRange.end.character,
        newText: newText,
    };
    const encoded = encodeURIComponent(JSON.stringify([args]));
    return `[${text}](command:radixHover.replaceLiteral?${encoded})`;
}

export function buildHoverText(
    num: ConvertationNumber,
    word: string,
    documentUri: vscode.Uri,
    wordRange: vscode.Range,
    registry: RadixRegistry
): string {
    const lines: string[] = [];

    lines.push(`**${word}** — число в системе с основанием ${num.base}`);
    lines.push('');
    lines.push('| Система | Значение |');
    lines.push('|---|---|');

    for (const system of registry.list()) {
        lines.push(`| ${system.label} | ${formatInSystem(system, num)} |`);
    }

    lines.push('');
    lines.push('Заменить на:');

    let row = '| Заменить на |';
    for (const system of registry.list()) {
        if (String(system.base) === num.base) continue;
        row += ` ${createLink(system.label, formatInSystem(system, num), documentUri, wordRange)} |`;
    }
    lines.push(row);

    return lines.join('\n');
}