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
const fs = require("fs");
const path = require("path");
function activate(context) {
    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = "toggle-sftp-button.toggleProfile";
    statusBarItem.tooltip = "Clique para alternar o perfil SFTP";
    function updateButtonLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                statusBarItem.text = "$(sync) SFTP: N/A"; // Nenhuma pasta aberta
                return;
            }
            const sftpConfigPath = path.join(workspaceFolders[0].uri.fsPath, ".vscode", "sftp.json");
            if (!fs.existsSync(sftpConfigPath)) {
                statusBarItem.text = "$(sync) SFTP: N/A"; // Arquivo não encontrado
                return;
            }
            try {
                const fileContent = fs.readFileSync(sftpConfigPath, "utf8");
                const config = JSON.parse(fileContent);
                const currentProfile = config.defaultProfile || "N/A";
                statusBarItem.text = currentProfile === "prod" ? "$(sync) SFTP: PROD" : "$(sync) SFTP: DEV";
            }
            catch (error) {
                statusBarItem.text = "$(sync) SFTP: ERRO";
            }
        });
    }
    updateButtonLabel(); // Atualiza ao iniciar
    statusBarItem.show();
    let disposable = vscode.commands.registerCommand("toggle-sftp-button.toggleProfile", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                return;
            }
            const sftpConfigPath = path.join(workspaceFolders[0].uri.fsPath, ".vscode", "sftp.json");
            if (!fs.existsSync(sftpConfigPath)) {
                return;
            }
            const document = yield vscode.workspace.openTextDocument(sftpConfigPath);
            let config = JSON.parse(document.getText());
            // Alterna entre 'dev' e 'prod'
            config.defaultProfile = config.defaultProfile === "dev" ? "prod" : "dev";
            // Atualiza o arquivo e força um "salvar"
            const edit = new vscode.WorkspaceEdit();
            edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), JSON.stringify(config, null, 4));
            yield vscode.workspace.applyEdit(edit);
            yield document.save();
            updateButtonLabel(); // Atualiza o botão imediatamente
        }
        catch (error) {
            console.error("Erro ao modificar o sftp.json:", error);
        }
    }));
    context.subscriptions.push(disposable, statusBarItem);
}
function deactivate() { }
