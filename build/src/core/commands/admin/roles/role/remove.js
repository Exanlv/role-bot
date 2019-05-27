"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../../_admin");
const functions_1 = require("../../../../functions");
class RemoveRoleCommand extends _admin_1.AdminCommand {
    runCommand() {
        this.loadInput();
        const roleName = this.input.ROLE || this.input.R;
        const categoryName = this.input.CATEGORY || this.input.C;
        if (!roleName || !categoryName) {
            this.sendMessage(`Could not remove self-assignable role; this command requires inputs, \`\`role:{${roleName ? 'true' : 'false'}}\`\` \`\`category:{${categoryName ? 'true' : 'false'}}\`\``);
            return;
        }
        if (!this.serverConfig.selfAssign.categoryExists(categoryName)) {
            this.sendMessage(`Could not remove self-assignable role; category \`\`${functions_1.firstLetterUppercase(categoryName)}\`\` does not exist`);
            return;
        }
        const role = this.message.guild.roles.find(r => r.name.toUpperCase() === roleName);
        if (!role) {
            this.sendMessage(`Could not remove self-assignable role; role \`\`${functions_1.firstLetterUppercase(roleName)}\`\` does not exist`);
            return;
        }
        if (!this.serverConfig.selfAssign.roleIsInCategory(categoryName, role.id)) {
            this.sendMessage(`Could not remove self-assignable role; role \`\`${role.name}\`\` is not in \`\`${functions_1.firstLetterUppercase(categoryName)}\`\``);
            return;
        }
        this.serverConfig.selfAssign.removeRole(categoryName, role.id);
        this.sendMessage(`Removed role \`\`${role.name}\`\` from self-assignable roles in category \`\`${functions_1.firstLetterUppercase(categoryName)}\`\``);
        this.serverConfig.saveConfig();
    }
}
exports.RemoveRoleCommand = RemoveRoleCommand;
