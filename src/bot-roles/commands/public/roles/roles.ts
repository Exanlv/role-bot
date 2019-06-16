import { BaseCommand, IBaseCommand } from '@classes/base-command';
import { List } from '@classes/list';
import { ListValue } from '@classes/list-value';
import { RoleCategory } from '@classes/role-category';
import { RoleConfig } from '@classes/role-config';
import { firstLetterUppercase } from '@core/functions';
import { Role } from 'discord.js';

export class RolesCommand extends BaseCommand implements IBaseCommand {
	public static description: string = 'Lists self-assignable roles';

	public runCommand(): void {
		const list = new List();

		this.serverConfig.selfAssign.raw().forEach((category: RoleCategory) => {
			const listValue = new ListValue();
			listValue.title = firstLetterUppercase(category.name);

			category.roles.forEach((role: RoleConfig) => {
				const guildRole = this.message.guild.roles.find((r: Role) => r.id === role.id);

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
