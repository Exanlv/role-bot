import { BaseCommandInterface, BaseCommand } from "../../../base-command";
import { firstLetterUppercase } from "../../../functions";

export class RemoveRoleCommand extends BaseCommand implements BaseCommandInterface {
	public static description: string = 'Remove a role';

	public runCommand() {
		const roleName = this.args.join(' ');

		if (!roleName) {
			this.sendMessage('No role given');
			return;
		}

		const role = this.message.guild.roles.find(r => {return r.name.toUpperCase() === roleName});

		if (!role) {
			this.sendMessage(`Could not remove role; role \`\`${firstLetterUppercase(roleName)}\`\` does not exist`);
			return;
		}

		if (!this.serverConfig.selfAssign.isSelfAssignable(role.id)) {
			this.sendMessage(`Could not remove role; role \`\`${role.name}\`\` is not self-assignable`);
			return;
		}

		if (!this.message.member.roles.some((memberRole) => {return memberRole.id === role.id})) {
			this.sendMessage(`Could not remove role; you do not have this role`);
			return;
		}

		this.message.member.removeRole(role)
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