import { AdminCommand } from "../../_admin";
import { BaseCommandInterface } from "../../../../base-command";
import { firstLetterUppercase } from "../../../../functions";

export class RemoveRoleCommand extends AdminCommand implements BaseCommandInterface {
    public runCommand() {
        this.loadInput();

		const roleName = this.input.ROLE || this.input.R;
		const categoryName = this.input.CATEGORY || this.input.C;

		if (!roleName || !categoryName) {
			this.sendMessage(`Could not remove self-assignable role; this command requires inputs, \`\`role:{${roleName ? 'true' : 'false'}}\`\` \`\`category:{${categoryName ? 'true' : 'false'}}\`\``);
			return;
		}

		if (!this.serverConfig.selfAssign.categoryExists(categoryName)) {
			this.sendMessage(`Could not remove self-assignable role; category \`\`${firstLetterUppercase(categoryName)}\`\` does not exist`);
			return;
		}

		const role = this.message.guild.roles.find(r => r.name.toUpperCase() === roleName);

		if (!role) {
			this.sendMessage(`Could not remove self-assignable role; role \`\`${firstLetterUppercase(roleName)}\`\` does not exist`);
			return;
		}

		if (!this.serverConfig.selfAssign.roleIsInCategory(categoryName, role.id)) {
			this.sendMessage(`Could not remove self-assignable role; role \`\`${role.name}\`\` is not in \`\`${firstLetterUppercase(categoryName)}\`\``);
			return;
		}

		this.serverConfig.selfAssign.removeRole(categoryName, role.id);
		this.sendMessage(`Removed role \`\`${role.name}\`\` from self-assignable roles in category \`\`${firstLetterUppercase(categoryName)}\`\``);
		this.serverConfig.saveConfig();   
    }
}