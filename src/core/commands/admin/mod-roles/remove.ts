import { BaseCommandInterface, BaseCommand } from "../../../base-command";
import { firstLetterUppercase } from "../../../functions";

export class RemoveModRoleCommand extends BaseCommand implements BaseCommandInterface {
	public static description: string = 'Removes a mod role';

	public async runCommand() {
		const roleName = this.args.join(' ') || await this.getUserInput('``> enter role name``');

		if (!roleName) {
			this.sendMessage('Could not remove mod-role; no role name was provided');
			return;
		}

		const role = this.message.guild.roles.find(r => r.name.toUpperCase() === roleName);

		if (!role) {
			this.sendMessage(`Could not remove mod-role; role \`\`${firstLetterUppercase(roleName)}\`\` does not exist`);
			return;
		}

		if (!this.serverConfig.adminRoles.includes(role.id)) {
			this.sendMessage(`Could not remove mod-role; role \`\`${role.name}\`\` is not a mod-role`);
			return;
		}

		this.serverConfig.adminRoles.splice(this.serverConfig.adminRoles.indexOf(role.id), 1);
		this.sendMessage(`Removed role \`\`${role.name}\`\` from mod-roles`);
	}
}