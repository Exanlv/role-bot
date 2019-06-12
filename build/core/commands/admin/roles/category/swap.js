"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../../_admin");
const functions_1 = require("../../../../functions");
class CategorySwapCommand extends _admin_1.AdminCommand {
    async runCommand() {
        this.loadInput();
        const categoryOne = this.input.CATEGORY1 || this.input.C1 || await this.getUserInput('``> enter the name of the first category``');
        if (!categoryOne) {
            this.sendMessage('Could not swap categories; category 1 is missing');
            return;
        }
        if (!this.serverConfig.selfAssign.categoryExists(categoryOne)) {
            this.sendMessage(`Could not swap categories; category \`\`${functions_1.firstLetterUppercase(categoryOne)}\`\` does not exist`);
            return;
        }
        const categoryTwo = this.input.CATEGORY2 || this.input.C2 || await this.getUserInput('``> enter the name of the second category``');
        if (!categoryTwo) {
            this.sendMessage('Could not swap categories; category 2 is missing');
            return;
        }
        if (!this.serverConfig.selfAssign.categoryExists(categoryTwo)) {
            this.sendMessage(`Could not swap categories; category \`\`${functions_1.firstLetterUppercase(categoryTwo)}\`\` does not exist`);
            return;
        }
        this.serverConfig.selfAssign.swapCategories(this.serverConfig.selfAssign.getCategory(categoryOne), this.serverConfig.selfAssign.getCategory(categoryTwo));
        this.sendMessage(`Swapped categories \`\`${functions_1.firstLetterUppercase(categoryOne)}\`\` and \`\`${functions_1.firstLetterUppercase(categoryTwo)}\`\``);
    }
}
exports.CategorySwapCommand = CategorySwapCommand;
