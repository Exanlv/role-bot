import { BaseCommand, IBaseCommand } from '@classes/base-command';
import { List } from '@classes/list';
import { ListValue } from '@classes/list-value';
import { RoleCategory } from '@classes/role-category';
import { firstLetterUppercase } from '@core/functions';

export class ListCategoryCommand extends BaseCommand implements IBaseCommand {
	public static description: string = 'Lists the current role categories';

	public runCommand(): void {
		const categorys = this.serverConfig.selfAssign.raw();
		const listValue = new ListValue();
		categorys.forEach((category: RoleCategory) => {
			listValue.values.push(`- ${firstLetterUppercase(category.name)}`);
		});

		if (!listValue.values.length) {
			this.sendMessage('There are currently no self-assign categorys');
			return;
		}

		listValue.title = 'Role Categorys';
		const list = new List();
		list.values.push(listValue);

		this.sendList(list);
	}
}
