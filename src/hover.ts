import * as vscode from 'vscode';
import { ConvertationNumber } from './numberLiteral';
import { RadixRegistry, formatInSystem } from './radixRegistry';

export function createLink(
    text: string,
    newText: string,
    documentUri: vscode.Uri,
    wordRange: vscode.Range,
    radixComment: number | null
): string {
    const args = {
        uri: documentUri.toString(),
        startLine: wordRange.start.line,
        startChar: wordRange.start.character,
        endLine: wordRange.end.line,
        endChar: wordRange.end.character,
        newText: newText,
        radixComment,
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
        const value = formatInSystem(system, num);

        const needsComment = system.prefix === '' && system.base !== 10;
        const radixComment = needsComment ? system.base : null;

        lines.push(`| ${createLink(system.label, value, documentUri, wordRange, radixComment)} | ${value} |`);
    }

    return lines.join('\n');
}