import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = "toggle-sftp-button.toggleProfile";
    statusBarItem.tooltip = "Clique para alternar o perfil SFTP";

    async function updateButtonLabel() {
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
        } catch (error) {
            statusBarItem.text = "$(sync) SFTP: ERRO";
        }
    }

    updateButtonLabel(); // Atualiza ao iniciar
    statusBarItem.show();

    let disposable = vscode.commands.registerCommand("toggle-sftp-button.toggleProfile", async () => {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                return;
            }

            const sftpConfigPath = path.join(workspaceFolders[0].uri.fsPath, ".vscode", "sftp.json");

            if (!fs.existsSync(sftpConfigPath)) {
                return;
            }

            const document = await vscode.workspace.openTextDocument(sftpConfigPath);
            let config = JSON.parse(document.getText());

            // Alterna entre 'dev' e 'prod'
            config.defaultProfile = config.defaultProfile === "dev" ? "prod" : "dev";

            // Atualiza o arquivo e força um "salvar"
            const edit = new vscode.WorkspaceEdit();
            edit.replace(
                document.uri,
                new vscode.Range(0, 0, document.lineCount, 0),
                JSON.stringify(config, null, 4)
            );
            await vscode.workspace.applyEdit(edit);
            await document.save();

            updateButtonLabel(); // Atualiza o botão imediatamente
        } catch (error) {
            console.error("Erro ao modificar o sftp.json:", error);
        }
    });

    context.subscriptions.push(disposable, statusBarItem);
}

export function deactivate() {}
