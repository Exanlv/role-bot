"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../../_admin");
const functions_1 = require("../../../../functions");
const list_value_1 = require("../../../../../shared/classes/list-value");
const list_1 = require("../../../../../shared/classes/list");
class ListRoleCommand extends _admin_1.AdminCommand {
    runCommand() {
        const categoryName = this.args.join(' ');
        const list = new list_1.List;
        if (!categoryName) {
            const categories = this.serverConfig.selfAssign.getCategories();
            categories.forEach(category => {
                list.values.push(this.getCategoryList(category));
            });
        }
        else {
            if (!this.serverConfig.selfAssign.categoryExists(categoryName)) {
                this.sendMessage(`Category \`\`${categoryName}\`\` does not exist`);
                return;
            }
            list.values.push(this.getCategoryList(categoryName));
        }
        if (!list.values.length) {
            this.sendMessage('No roles/category are currently set up');
            return;
        }
        this.sendList(list);
    }
    getCategoryList(categoryName) {
        const category = this.serverConfig.selfAssign.getCategory(categoryName);
        const listValue = new list_value_1.ListValue;
        category.roles.forEach(role => {
            let guildRole = this.message.guild.roles.find(r => r.id === role.id);
            if (!guildRole) {
                this.serverConfig.selfAssign.handleRemovedRole(role.id);
                return;
            }
            listValue.values.push(`- ${guildRole.name}, ${guildRole.members.size} user(s)`);
        });
        if (!listValue.values.length) {
            listValue.values.push('No self-assignable roles');
        }
        listValue.title = functions_1.firstLetterUppercase(categoryName);
        return listValue;
    }
}
exports.ListRoleCommand = ListRoleCommand;
