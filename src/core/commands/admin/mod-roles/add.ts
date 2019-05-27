import { AdminCommand } from "../_admin";
import { BaseCommandInterface } from "../../../base-command";
import { firstLetterUppercase } from "../../../functions";

export class AddModRoleCommand extends AdminCommand implements BaseCommandInterface {
	public runCommand() {
		const roleName = this.args.join(' ');

		if (!roleName) {
			this.sendMessage('Could not add mod-role; no role name was provided');
			return;
		}

		const role = this.message.guild.roles.find(r => r.name.toUpperCase() === roleName);

		if (!role) {
			this.sendMessage(`Could not add mod-role; role \`\`${firstLetterUppercase(roleName)}\`\` does not exist`);
			return;
		}

		if (this.serverConfig.adminRoles.includes(role.id)) {
			this.sendMessage(`Could not add mod-role; role \`\`${role.name}\`\` is already a mod-role`);
			return;
		}

		this.serverConfig.adminRoles.push(role.id);
		this.serverConfig.saveConfig();
		this.sendMessage(`Added role \`\`${role.name}\`\` as mod-role`);
	}
}