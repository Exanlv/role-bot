"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../../_admin");
const functions_1 = require("../../../../functions");
class AddRoleCommand extends _admin_1.AdminCommand {
    async runCommand() {
        this.loadInput();
        const roleName = this.input.ROLE || this.input.R || await this.getUserInput('``> enter role name``');
        if (!roleName) {
            this.sendMessage('Could not add self-assignable role; no role was given');
            return;
        }
        const role = this.message.guild.roles.find(r => r.name.toUpperCase() === roleName);
        if (!role) {
            this.sendMessage(`Could not add self-assignable role; role \`\`${functions_1.firstLetterUppercase(roleName)}\`\` does not exist`);
            return;
        }
        const categoryName = this.input.CATEGORY || this.input.C || await this.getUserInput('``> enter category name``');
        if (!categoryName) {
            this.sendMessage('Could not add self-assignable role; no category was given');
            return;
        }
        if (!this.serverConfig.selfAssign.categoryExists(categoryName)) {
            this.sendMessage(`Could not add self-assignable role; category \`\`${functions_1.firstLetterUppercase(categoryName)}\`\` does not exist`);
            return;
        }
        if (this.serverConfig.selfAssign.roleIsInCategory(categoryName, role.id)) {
            this.sendMessage(`Could not add self-assignable role; role \`\`${role.name}\`\` already is in category \`\`${functions_1.firstLetterUppercase(categoryName)}\`\``);
            return;
        }
        this.serverConfig.selfAssign.addRole(categoryName, role.id);
        this.sendMessage(`Added role \`\`${role.name}\`\` as self-assignable role in category \`\`${functions_1.firstLetterUppercase(categoryName)}\`\``);
    }
}
exports.AddRoleCommand = AddRoleCommand;
