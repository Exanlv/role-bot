import { BaseCommandInterface, BaseCommand } from "../../../base-command";
import { ListValue } from "../../../../shared/classes/list-value";
import { List } from "../../../../shared/classes/list";

export class ListModRoleCommand extends BaseCommand implements BaseCommandInterface {
	public runCommand() {
		let listValue = new ListValue;
		listValue.title = 'Mod roles'

		this.serverConfig.adminRoles.forEach(adminRole => {
			const role = this.message.guild.roles.find(r => r.id === adminRole);

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

		const list = new List;
		list.values.push(listValue);

		this.sendList(list);
	}
}