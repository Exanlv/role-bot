import { AdminCommand } from "../../_admin";
import { BaseCommandInterface } from "../../../../base-command";
import { List } from "../../../../../shared/classes/list";
import { ListValue } from "../../../../../shared/classes/list-value";
import { firstLetterUppercase } from "../../../../functions";

export class ListCategoryCommand extends AdminCommand implements BaseCommandInterface {
    public runCommand() {
        const categorys = this.serverConfig.selfAssign.raw();
		const listValue = new ListValue;
		categorys.forEach(category => {
			listValue.values.push(`- ${firstLetterUppercase(category.name)}`);
		});

		if (!listValue.values.length) {
			this.sendMessage('There are currently no self-assign categorys');
			return;
		}

		listValue.title = 'Role Categorys';
		const list = new List;
		list.values.push(listValue);

		this.sendList(list);
    }
}