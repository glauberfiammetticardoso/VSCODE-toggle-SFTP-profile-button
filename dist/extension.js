"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const path = require("path");
let statusBarItem;
function activate(context) {
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
function updateButtonText() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const workspaceFolder = (_a = vscode.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a[0];
        if (!workspaceFolder) {
            statusBarItem.text = 'SFTP: Nenhuma pasta aberta';
            return;
        }
        const configPath = path.join(workspaceFolder.uri.fsPath, '.vscode', 'sftp.json');
        try {
            const fileUri = vscode.Uri.file(configPath);
            const fileContent = yield vscode.workspace.fs.readFile(fileUri);
            const config = JSON.parse(fileContent.toString());
            if (!config.profiles || !config.defaultProfile) {
                statusBarItem.text = 'SFTP: Configuração inválida';
                return;
            }
            statusBarItem.text = `SFTP: ${config.defaultProfile.toUpperCase()}`;
        }
        catch (error) {
            statusBarItem.text = 'SFTP: Erro ao ler configuração';
        }
    });
}
function toggleSFTPProfile() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const workspaceFolder = (_a = vscode.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('Nenhuma pasta aberta para configurar o SFTP.');
            return;
        }
        const configPath = path.join(workspaceFolder.uri.fsPath, '.vscode', 'sftp.json');
        try {
            const fileUri = vscode.Uri.file(configPath);
            const fileContent = yield vscode.workspace.fs.readFile(fileUri);
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
            yield vscode.workspace.fs.writeFile(fileUri, uint8array);
            // Executa o comando sftp.setProfile para aplicar o perfil selecionado
            yield vscode.commands.executeCommand('sftp.setProfile', config.defaultProfile);
            // Atualiza o texto da barra de status
            updateButtonText();
        }
        catch (error) {
            vscode.window.showErrorMessage(`Erro ao modificar o sftp.json: ${error.message}`);
        }
    });
}
function deactivate() { }
