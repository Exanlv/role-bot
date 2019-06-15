import { BaseCommandInterface, BaseCommand } from "../../../../base-command";
import { firstLetterUppercase } from "../../../../functions";
import { ListValue } from "../../../../../shared/classes/list-value";
import { List } from "../../../../../shared/classes/list";

export class ListRoleCommand extends BaseCommand implements BaseCommandInterface {
	public static description: string = 'Lists the current self-assignable roles';

	public runCommand() {
		const categoryName = this.args.join(' ');
		const list = new List;

		if (!categoryName) {
			const categories = this.serverConfig.selfAssign.getCategories();
			categories.forEach(category => {
				list.values.push(this.getCategoryList(category));
			});
		} else {
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

    private getCategoryList(categoryName) {
		const category = this.serverConfig.selfAssign.getCategory(categoryName);
		const listValue = new ListValue;
		
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

		listValue.title = firstLetterUppercase(categoryName);

		return listValue;
	}
}