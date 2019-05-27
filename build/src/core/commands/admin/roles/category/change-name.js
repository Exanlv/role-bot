"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../../_admin");
const functions_1 = require("../../../../functions");
class ChangeCategoryNameCommand extends _admin_1.AdminCommand {
    runCommand() {
        this.loadInput();
        const oldName = this.input.OLDNAME || this.input.ON;
        const newName = this.input.NEWNAME || this.input.NN;
        if (!oldName) {
            this.sendMessage(`Could not change category name; no current category name was given`);
            return;
        }
        if (!newName) {
            this.sendMessage(`Could not change category name; no new category name was given`);
            return;
        }
        if (newName.lenght > 50) {
            this.sendMessage(`Could not change category name; given category name is too long, max. 50 characters`);
            return;
        }
        if (!this.serverConfig.selfAssign.categoryExists(oldName)) {
            this.sendMessage(`Could not change category name; category \`\`${functions_1.firstLetterUppercase(oldName)}\`\` does not exist`);
            return;
        }
        if (this.serverConfig.selfAssign.categoryExists(newName)) {
            this.sendMessage(`Could not change category name; category \`\`${functions_1.firstLetterUppercase(newName)}\`\` already exists`);
            return;
        }
        this.serverConfig.selfAssign.changeCategoryName(oldName, newName);
        this.serverConfig.saveConfig();
        this.sendMessage(`Category \`\`${functions_1.firstLetterUppercase(oldName)}\`\` changed to \`\`${functions_1.firstLetterUppercase(newName)}\`\``);
    }
}
exports.ChangeCategoryNameCommand = ChangeCategoryNameCommand;
