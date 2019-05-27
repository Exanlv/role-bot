"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _public_1 = require("../_public");
const list_1 = require("../../../../shared/classes/list");
const list_value_1 = require("../../../../shared/classes/list-value");
const functions_1 = require("../../../functions");
class RolesCommand extends _public_1.PublicCommand {
    runCommand() {
        const list = new list_1.List;
        this.serverConfig.selfAssign.raw().forEach(category => {
            let listValue = new list_value_1.ListValue;
            listValue.title = functions_1.firstLetterUppercase(category.name);
            category.roles.forEach(role => {
                let guildRole = this.message.guild.roles.find(r => r.id === role.id);
                if (!guildRole) {
                    this.serverConfig.selfAssign.removeRole(category.name, role.id);
                    return;
                }
                listValue.values.push(`- ${guildRole.name}`);
            });
            if (!listValue.values.length) {
                listValue.values.push('- No self-assignable roles');
            }
            list.values.push(listValue);
        });
        if (!list.values.length) {
            this.sendMessage('There are no self-assignable roles');
            return;
        }
        this.sendList(list);
    }
}
exports.RolesCommand = RolesCommand;
