import { BaseCommand, IBaseCommand } from '@classes/base-command';
import { firstLetterUppercase } from '@core/functions';
import { Role } from 'discord.js';

export class RemoveRoleCommand extends BaseCommand implements IBaseCommand {
	public static description: string = 'Makes a role no longer self-assignable';

	public async runCommand(): Promise<void> {
		this.loadInput();

		const roleName = this.input.ROLE || this.input.R || await this.getUserInput('``> enter role name``');

		if (!roleName) {
			this.sendMessage('Could not remove self-assignable role; no role name was given');
			return;
		}

		const role = this.message.guild.roles.find((r: Role) => r.name.toUpperCase() === roleName);

		if (!role) {
			this.sendMessage(`Could not remove self-assignable role; role \`\`${firstLetterUppercase(roleName)}\`\` does not exist`);
			return;
		}

		const categoryName = this.input.CATEGORY || this.input.C || await this.getUserInput('``> enter category name``');

		if (!categoryName) {
			this.sendMessage(`Could not remove self-assignable role; no category name was given`);
			return;
		}

		if (!this.serverConfig.selfAssign.categoryExists(categoryName)) {
			this.sendMessage(`Could not remove self-assignable role; category \`\`${firstLetterUppercase(categoryName)}\`\` does not exist`);
			return;
		}

		if (!this.serverConfig.selfAssign.roleIsInCategory(categoryName, role.id)) {
			this.sendMessage(`Could not remove self-assignable role; role \`\`${role.name}\`\` is not in \`\`${firstLetterUppercase(categoryName)}\`\``);
			return;
		}

		this.serverConfig.selfAssign.removeRole(categoryName, role.id);
		this.sendMessage(`Removed role \`\`${role.name}\`\` from self-assignable roles in category \`\`${firstLetterUppercase(categoryName)}\`\``);
	}
}
