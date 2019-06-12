"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../_admin");
const list_value_1 = require("../../../../shared/classes/list-value");
const list_1 = require("../../../../shared/classes/list");
class ListModRoleCommand extends _admin_1.AdminCommand {
    runCommand() {
        let listValue = new list_value_1.ListValue;
        listValue.title = 'Mod roles';
        this.serverConfig.adminRoles.forEach(adminRole => {
            const role = this.message.guild.roles.find(r => r.id === adminRole);
            if (!role) {
                this.serverConfig.adminRoles.splice(this.serverConfig.adminRoles.indexOf(adminRole, 1));
                return;
            }
            listValue.values.push(`- ${role.name}`);
        });
        if (!listValue.values.length) {
            this.sendMessage('There are no mod-roles');
            return;
        }
        const list = new list_1.List;
        list.values.push(listValue);
        this.sendList(list);
    }
}
exports.ListModRoleCommand = ListModRoleCommand;
