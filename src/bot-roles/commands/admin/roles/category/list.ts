import { BaseCommandInterface, BaseCommand } from "@classes/base-command";
import { List } from "@classes/list";
import { ListValue } from "@classes/list-value";
import { firstLetterUppercase } from "@core/functions";

export class ListCategoryCommand extends BaseCommand implements BaseCommandInterface {
	public static description: string = 'Lists the current role categories';

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