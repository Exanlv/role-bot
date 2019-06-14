import { BaseCommandInterface, BaseCommand } from "../../../base-command";
import { firstLetterUppercase } from "../../../functions";

export class AddModRoleCommand extends BaseCommand implements BaseCommandInterface {
	public async runCommand() {
		const roleName = this.args.join(' ') || await this.getUserInput('``> enter role name``');

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
		this.sendMessage(`Added role \`\`${role.name}\`\` as mod-role`);
	}
}