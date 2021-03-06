import { BaseCommand, IBaseCommand } from '@classes/base-command';
import { firstLetterUppercase } from '@core/functions';
import { Role } from 'discord.js';

export class AddRoleCommand extends BaseCommand implements IBaseCommand {
	public static description: string = 'Adds a self-assignable role';

	public async runCommand(): Promise<void> {
		this.loadInput();

		const roleName = this.input.ROLE || this.input.R || await this.getUserInput('``> enter role name``');

		if (!roleName) {
			this.sendMessage('Could not add self-assignable role; no role was given');
			return;
		}

		const role = this.message.guild.roles.find((r: Role) => r.name.toUpperCase() === roleName);

		if (!role) {
			this.sendMessage(`Could not add self-assignable role; role \`\`${firstLetterUppercase(roleName)}\`\` does not exist`);
			return;
		}

		const categoryName = this.input.CATEGORY || this.input.C || await this.getUserInput('``> enter category name``');

		if (!categoryName) {
			this.sendMessage('Could not add self-assignable role; no category was given');
			return;
		}

		if (!this.serverConfig.selfAssign.categoryExists(categoryName)) {
			this.sendMessage(`Could not add self-assignable role; category \`\`${firstLetterUppercase(categoryName)}\`\` does not exist`);
			return;
		}

		if (this.serverConfig.selfAssign.roleIsInCategory(categoryName, role.id)) {
			this.sendMessage(`Could not add self-assignable role; role \`\`${role.name}\`\` already is in category \`\`${firstLetterUppercase(categoryName)}\`\``);
			return;
		}

		this.serverConfig.selfAssign.addRole(categoryName, role.id);
		this.sendMessage(`Added role \`\`${role.name}\`\` as self-assignable role in category \`\`${firstLetterUppercase(categoryName)}\`\``);
	}
}
