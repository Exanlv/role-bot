"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../_admin");
const functions_1 = require("../../../functions");
class AddModRoleCommand extends _admin_1.AdminCommand {
    runCommand() {
        const roleName = this.args.join(' ');
        if (!roleName) {
            this.sendMessage('Could not add mod-role; no role name was provided');
            return;
        }
        const role = this.message.guild.roles.find(r => r.name.toUpperCase() === roleName);
        if (!role) {
            this.sendMessage(`Could not add mod-role; role \`\`${functions_1.firstLetterUppercase(roleName)}\`\` does not exist`);
            return;
        }
        if (this.serverConfig.adminRoles.includes(role.id)) {
            this.sendMessage(`Could not add mod-role; role \`\`${role.name}\`\` is already a mod-role`);
            return;
        }
        this.serverConfig.adminRoles.push(role.id);
        this.serverConfig.saveConfig();
        this.sendMessage(`Added role \`\`${role.name}\`\` as mod-role`);
    }
}
exports.AddModRoleCommand = AddModRoleCommand;
