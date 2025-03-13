import * as vscode from 'vscode';
import * as path from 'path';

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'extension.toggleSFTP';
    context.subscriptions.push(statusBarItem);

    updateButtonText();
    statusBarItem.show();

    let disposable = vscode.commands.registerCommand('extension.toggleSFTP', () => {
        toggleSFTPProfile();
    });

    context.subscriptions.push(disposable);
}

async function updateButtonText() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        statusBarItem.text = 'SFTP: Nenhuma pasta aberta';
        return;
    }

    const configPath = path.join(workspaceFolder.uri.fsPath, '.vscode', 'sftp.json');
    try {
        const fileUri = vscode.Uri.file(configPath);
        const fileContent = await vscode.workspace.fs.readFile(fileUri);
        const config = JSON.parse(fileContent.toString());

        if (!config.profiles || !config.defaultProfile) {
            statusBarItem.text = 'SFTP: Configuração inválida';
            return;
        }

        statusBarItem.text = `SFTP: ${config.defaultProfile.toUpperCase()}`;
    } catch (error) {
        statusBarItem.text = 'SFTP: Erro ao ler configuração';
    }
}

async function toggleSFTPProfile() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('Nenhuma pasta aberta para configurar o SFTP.');
        return;
    }

    const configPath = path.join(workspaceFolder.uri.fsPath, '.vscode', 'sftp.json');
    try {
        const fileUri = vscode.Uri.file(configPath);
        const fileContent = await vscode.workspace.fs.readFile(fileUri);
        let config = JSON.parse(fileContent.toString());

        if (!config.profiles || typeof config.profiles !== 'object') {
            vscode.window.showErrorMessage('Configuração de perfis inválida no sftp.json.');
            return;
        }

        const profiles = Object.keys(config.profiles);
        const currentIndex = profiles.indexOf(config.defaultProfile);
        const nextIndex = (currentIndex + 1) % profiles.length;
        config.defaultProfile = profiles[nextIndex];

        const newContent = JSON.stringify(config, null, 4);
        const uint8array = new TextEncoder().encode(newContent);

        // Salva o arquivo utilizando a API do workspace.fs
        await vscode.workspace.fs.writeFile(fileUri, uint8array);

        // Executa o comando sftp.setProfile para aplicar o perfil selecionado
        await vscode.commands.executeCommand('sftp.setProfile', config.defaultProfile);

        // Atualiza o texto da barra de status
        updateButtonText();
    } catch (error) {
        vscode.window.showErrorMessage(`Erro ao modificar o sftp.json: ${(error as Error).message}`);
    }
}

export function deactivate() {}
