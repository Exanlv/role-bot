import { BaseCommand, IBaseCommand } from '@classes/base-command';
import { List } from '@classes/list';
import { ListValue } from '@classes/list-value';
import { Role } from 'discord.js';

export class ListModRoleCommand extends BaseCommand implements IBaseCommand {
	public static description: string = 'Lists the current mod roles';

	public runCommand(): void {
		const listValue = new ListValue();
		listValue.title = 'Mod roles';

		this.serverConfig.adminRoles.forEach((adminRole: string) => {
			const role = this.message.guild.roles.find((r: Role) => r.id === adminRole);

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

		const list = new List();
		list.values.push(listValue);

		this.sendList(list);
	}
}
