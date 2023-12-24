// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  if (!vscode.workspace.getConfiguration("open-in-scenebuilder").get("scenebuilderExecutable")) {
    vscode.window.showInformationMessage(
      "Please set the path to your Scene Builder executable in the settings."
    );
    return;
  }

  context.subscriptions.push(
    vscode.commands.registerCommand("open-in-scenebuilder.openSelectedFile", (cmdArg: vscode.Uri) =>
      open(cmdArg.fsPath)
    ),
    vscode.commands.registerCommand("open-in-scenebuilder.openCurrentFile", () => {
      const fsPath = vscode.window.activeTextEditor?.document.uri.fsPath;
      if (!fsPath) {
        return;
      }
      if (path.basename(fsPath).split(".").at(-1) !== "fxml") {
        vscode.window.showInformationMessage("The active file must be a FXML file.");
        return;
      }
      open(fsPath);
    })
  );
}

function open(fsPath: string) {
  vscode.window
    .createTerminal({ name: "Scene Builder", hideFromUser: true, isTransient: true })
    .sendText(
      `${vscode.workspace
        .getConfiguration("open-in-scenebuilder")
        .get("scenebuilderExecutable")} "${fsPath}"`,
      true
    );
}
