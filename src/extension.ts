import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext): void {
    const disposable = vscode.commands.registerCommand('radixHover.hello',() => {
        vscode.window.showInformationMessage('Hello');
    });
    context.subscriptions.push(disposable);
}

export function deactivate(): void {}