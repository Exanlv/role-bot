"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../_admin");
const functions_1 = require("../../../functions");
class RemoveModRoleCommand extends _admin_1.AdminCommand {
    runCommand() {
        const roleName = this.args.join(' ');
        if (!roleName) {
            this.sendMessage('Could not remove mod-role; no role name was provided');
            return;
        }
        const role = this.message.guild.roles.find(r => r.name.toUpperCase() === roleName);
        if (!role) {
            this.sendMessage(`Could not remove mod-role; role \`\`${functions_1.firstLetterUppercase(roleName)}\`\` does not exist`);
            return;
        }
        if (!this.serverConfig.adminRoles.includes(role.id)) {
            this.sendMessage(`Could not remove mod-role; role \`\`${role.name}\`\` is not a mod-role`);
            return;
        }
        this.serverConfig.adminRoles.splice(this.serverConfig.adminRoles.indexOf(role.id), 1);
        this.serverConfig.saveConfig();
        this.sendMessage(`Removed role \`\`${role.name}\`\` from mod-roles`);
    }
}
exports.RemoveModRoleCommand = RemoveModRoleCommand;
