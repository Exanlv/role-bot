"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../../_admin");
const functions_1 = require("../../../../functions");
class AddCategoryCommand extends _admin_1.AdminCommand {
    async runCommand() {
        const categoryName = this.args.join(' ') || await this.getUserInput('``> enter a name for the category you want to create``');
        if (!categoryName) {
            this.sendMessage('Could not add category; no category name was given');
            return;
        }
        if (categoryName.length > 50) {
            this.sendMessage('Could not add category; given category name is too long, max. 50 characters');
            return;
        }
        if (this.serverConfig.selfAssign.categoryExists(categoryName)) {
            this.sendMessage(`Could not add category; category \`\`${functions_1.firstLetterUppercase(categoryName)}\`\` already exists`);
            return;
        }
        this.serverConfig.selfAssign.addCategory(categoryName);
        this.sendMessage(`Added category \`\`${functions_1.firstLetterUppercase(categoryName)}\`\``);
    }
}
exports.AddCategoryCommand = AddCategoryCommand;
