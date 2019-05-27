import { AdminCommand } from "../../_admin";
import { BaseCommandInterface } from "../../../../base-command";
import { firstLetterUppercase } from "../../../../functions";

export class AddRoleCommand extends AdminCommand implements BaseCommandInterface {
    public runCommand() {
        this.loadInput();

		const roleName = this.input.ROLE || this.input.R;
		const categoryName = this.input.CATEGORY || this.input.C;

		if (!roleName || !categoryName) {
			this.sendMessage(`Could not add self-assignable role; this command requires inputs, \`\`role:{${roleName ? 'true' : 'false'}}\`\` \`\`category:{${categoryName ? 'true' : 'false'}}\`\``);
			return;
		}

		if (!this.serverConfig.selfAssign.categoryExists(categoryName)) {
			this.sendMessage(`Could not add self-assignable role; category \`\`${firstLetterUppercase(categoryName)}\`\` does not exist`);
			return;
		}


		const role = this.message.guild.roles.find(r => r.name.toUpperCase() === roleName);

		if (!role) {
			this.sendMessage(`Could not add self-assignable role; role \`\`${firstLetterUppercase(roleName)}\`\` does not exist`);
			return;
		}

		if (this.serverConfig.selfAssign.roleIsInCategory(categoryName, role.id)) {
			this.sendMessage(`Could not add self-assignable role; role \`\`${role.name}\`\` already is in category \`\`${firstLetterUppercase(categoryName)}\`\``);
			return;
		}

		this.serverConfig.selfAssign.addRole(categoryName, role.id);
		this.sendMessage(`Added role \`\`${role.name}\`\` as self-assignable role in category \`\`${firstLetterUppercase(categoryName)}\`\``);
		this.serverConfig.saveConfig();   
    }
}