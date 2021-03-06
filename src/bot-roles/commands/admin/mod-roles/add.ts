import { BaseCommand, IBaseCommand } from '@classes/base-command';
import { firstLetterUppercase } from '@core/functions';
import { Role } from 'discord.js';

export class AddModRoleCommand extends BaseCommand implements IBaseCommand {
	public static description: string = 'Adds a mod role';

	public async runCommand(): Promise<void> {
		const roleName = this.args.join(' ') || await this.getUserInput('``> enter role name``');

		if (!roleName) {
			this.sendMessage('Could not add mod-role; no role name was provided');
			return;
		}

		const role = this.message.guild.roles.find((r: Role) => r.name.toUpperCase() === roleName);

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
