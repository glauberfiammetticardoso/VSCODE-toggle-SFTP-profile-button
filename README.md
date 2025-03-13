# SFTP Profile Toggle for VSCode

**Description:** This extension allows users to easily toggle between multiple SFTP profiles directly from the VSCode status bar. With a simple click, you can switch the active profile used for SFTP connections, making it more convenient for developers who work with different environments or servers.

**Features:**
- **Toggle Between Profiles:** Quickly switch between different SFTP profiles defined in your `sftp.json` configuration file.
- **Status Bar Integration:** View the currently active SFTP profile in the VSCode status bar.
- **Easy Profile Management:** Automatically detects available profiles and updates the status bar based on the currently selected profile.
- **Command to Change Profile:** The extension supports toggling profiles through a custom command registered in VSCode, which is mapped to a clickable status bar item.

**Installation:**
1. Clone this repository or download the `.vsix` file from the Releases section.
2. Install the extension in VSCode by dragging and dropping the `.vsix` file, or use the VSCode extension marketplace if available.
3. Ensure you have a valid `sftp.json` configuration file located in the `.vscode` folder of your project.

**Usage:**
1. After installing the extension, a status bar item will appear on the right side of your VSCode window.
2. Click the status bar item to toggle between available SFTP profiles defined in your `sftp.json` configuration.
3. You can configure multiple profiles in the `sftp.json` file and switch between them as needed.

**Contributing:**
1. Fork this repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to your forked branch (`git push origin feature-branch`).
5. Open a Pull Request to propose your changes.

**License:** MIT License. See the [LICENSE](LICENSE) file for more details.
