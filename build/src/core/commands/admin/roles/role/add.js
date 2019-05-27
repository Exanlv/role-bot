"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../../_admin");
const functions_1 = require("../../../../functions");
class AddRoleCommand extends _admin_1.AdminCommand {
    runCommand() {
        this.loadInput();
        const roleName = this.input.ROLE || this.input.R;
        const categoryName = this.input.CATEGORY || this.input.C;
        if (!roleName || !categoryName) {
            this.sendMessage(`Could not add self-assignable role; this command requires inputs, \`\`role:{${roleName ? 'true' : 'false'}}\`\` \`\`category:{${categoryName ? 'true' : 'false'}}\`\``);
            return;
        }
        if (!this.serverConfig.selfAssign.categoryExists(categoryName)) {
            this.sendMessage(`Could not add self-assignable role; category \`\`${functions_1.firstLetterUppercase(categoryName)}\`\` does not exist`);
            return;
        }
        const role = this.message.guild.roles.find(r => r.name.toUpperCase() === roleName);
        if (!role) {
            this.sendMessage(`Could not add self-assignable role; role \`\`${functions_1.firstLetterUppercase(roleName)}\`\` does not exist`);
            return;
        }
        if (this.serverConfig.selfAssign.roleIsInCategory(categoryName, role.id)) {
            this.sendMessage(`Could not add self-assignable role; role \`\`${role.name}\`\` already is in category \`\`${functions_1.firstLetterUppercase(categoryName)}\`\``);
            return;
        }
        this.serverConfig.selfAssign.addRole(categoryName, role.id);
        this.sendMessage(`Added role \`\`${role.name}\`\` as self-assignable role in category \`\`${functions_1.firstLetterUppercase(categoryName)}\`\``);
        this.serverConfig.saveConfig();
    }
}
exports.AddRoleCommand = AddRoleCommand;
