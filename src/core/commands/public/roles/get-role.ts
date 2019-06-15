import { BaseCommandInterface, BaseCommand } from "../../../base-command";
import { firstLetterUppercase } from "../../../functions";

export class GetRoleCommand extends BaseCommand implements BaseCommandInterface {
	public static description: string = 'Get a role';

	runCommand() {
		const roleName = this.args.join(' ');

		if (!roleName) {
			this.sendMessage('No role given');
			return;
		}

		const role = this.message.guild.roles.find(r => {return r.name.toUpperCase() === roleName});

		if (!role) {
			this.sendMessage(`Could not assign role; role \`\`${firstLetterUppercase(roleName)}\`\` does not exist`);
			return;
		}

		if (!this.serverConfig.selfAssign.isSelfAssignable(role.id)) {
			this.sendMessage(`Could not assign role; role \`\`${role.name}\`\` is not self-assignable`);
			return;
		}

		if (this.message.member.roles.some((memberRole) => {return memberRole.id === role.id})) {
			this.sendMessage(`Could not assign role; you already have this role`);
			return;
		}

		this.message.member.addRole(role)
			.catch(error => {
				this.handleError(error, 'HandleRoles');
			})
			.then(e => {
				this.message.react('👍')
					.catch(e => {this.handleError(e, 'ApplyReact')})
				;
			})
		;
	}
}