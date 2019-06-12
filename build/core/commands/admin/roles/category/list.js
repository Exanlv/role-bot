"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../../_admin");
const list_1 = require("../../../../../shared/classes/list");
const list_value_1 = require("../../../../../shared/classes/list-value");
const functions_1 = require("../../../../functions");
class ListCategoryCommand extends _admin_1.AdminCommand {
    runCommand() {
        const categorys = this.serverConfig.selfAssign.raw();
        const listValue = new list_value_1.ListValue;
        categorys.forEach(category => {
            listValue.values.push(`- ${functions_1.firstLetterUppercase(category.name)}`);
        });
        if (!listValue.values.length) {
            this.sendMessage('There are currently no self-assign categorys');
            return;
        }
        listValue.title = 'Role Categorys';
        const list = new list_1.List;
        list.values.push(listValue);
        this.sendList(list);
    }
}
exports.ListCategoryCommand = ListCategoryCommand;
