"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../../_admin");
const functions_1 = require("../../../../functions");
class RemoveCategoryCommand extends _admin_1.AdminCommand {
    runCommand() {
        const categoryName = this.args.join(' ');
        if (!categoryName) {
            this.sendMessage('Could not remove category; no category name was given');
            return;
        }
        if (!this.serverConfig.selfAssign.categoryExists(categoryName)) {
            this.sendMessage(`Could not remove category; category \`\`${functions_1.firstLetterUppercase(categoryName)}\`\` does not exist`);
            return;
        }
        this.serverConfig.selfAssign.removeCategory(categoryName);
        this.sendMessage(`Removed category \`\`${functions_1.firstLetterUppercase(categoryName)}\`\``);
        this.serverConfig.saveConfig();
    }
}
exports.RemoveCategoryCommand = RemoveCategoryCommand;
