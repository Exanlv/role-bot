import { BaseCommand, IBaseCommand } from '@classes/base-command';
import { firstLetterUppercase } from '@core/functions';
import { DiscordAPIError, GuildMember, Role } from 'discord.js';

export class GetRoleCommand extends BaseCommand implements IBaseCommand {
	public static description: string = 'Get a role';

	public runCommand(): void {
		const roleName = this.args.join(' ');

		if (!roleName) {
			this.sendMessage('No role given');
			return;
		}

		const role = this.message.guild.roles.find((r: Role) => r.name.toUpperCase() === roleName);

		if (!role) {
			this.sendMessage(`Could not assign role; role \`\`${firstLetterUppercase(roleName)}\`\` does not exist`);
			return;
		}

		if (!this.serverConfig.selfAssign.isSelfAssignable(role.id)) {
			this.sendMessage(`Could not assign role; role \`\`${role.name}\`\` is not self-assignable`);
			return;
		}

		if (this.message.member.roles.some((memberRole: Role) => memberRole.id === role.id)) {
			this.sendMessage(`Could not assign role; you already have this role`);
			return;
		}

		this.message.member.addRole(role)
			.catch((error: DiscordAPIError) => {
				this.handleError(error, 'HandleRoles');
			})
			.then((e: GuildMember) => {
				this.message.react('👍')
					.catch((e: DiscordAPIError) => {this.handleError(e, 'ApplyReact'); })
				;
			})
		;
	}
}
