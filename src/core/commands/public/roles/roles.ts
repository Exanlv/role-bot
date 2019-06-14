import { BaseCommandInterface, BaseCommand } from "../../../base-command";
import { List } from "../../../../shared/classes/list";
import { ListValue } from "../../../../shared/classes/list-value";
import { firstLetterUppercase } from "../../../functions";

export class RolesCommand extends BaseCommand implements BaseCommandInterface {
	public runCommand() {
		const list = new List;

		this.serverConfig.selfAssign.raw().forEach(category => {
			let listValue = new ListValue;
			listValue.title = firstLetterUppercase(category.name);

			category.roles.forEach(role => {
				let guildRole = this.message.guild.roles.find(r => r.id === role.id);

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