import { BaseCommand, IBaseCommand } from '@classes/base-command';
import { List } from '@classes/list';
import { ListValue } from '@classes/list-value';
import { RoleConfig } from '@classes/role-config';
import { firstLetterUppercase } from '@core/functions';
import { Role } from 'discord.js';

export class ListRoleCommand extends BaseCommand implements IBaseCommand {
	public static description: string = 'Lists the current self-assignable roles';

	public runCommand(): void {
		const categoryName = this.args.join(' ');
		const list = new List();

		if (!categoryName) {
			const categories = this.serverConfig.selfAssign.getCategories();
			categories.forEach((category: string) => {
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

	private getCategoryList(categoryName: string): ListValue {
		const category = this.serverConfig.selfAssign.getCategory(categoryName);
		const listValue = new ListValue();

		category.roles.forEach((role: RoleConfig) => {
			const guildRole = this.message.guild.roles.find((r: Role) => r.id === role.id);

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
