import { AdminCommand } from "../../_admin";
import { BaseCommandInterface } from "../../../../base-command";
import { firstLetterUppercase } from "../../../../functions";

export class ChangeCategoryNameCommand extends AdminCommand implements BaseCommandInterface {
	public runCommand() {
		this.loadInput();

		const oldName = this.input.OLDNAME || this.input.ON;
		const newName = this.input.NEWNAME || this.input.NN;

		if (!oldName) {
			this.sendMessage(`Could not change category name; no current category name was given`);
			return;
		}

		if (!newName) {
			this.sendMessage(`Could not change category name; no new category name was given`);
			return;
		}

		if (newName.lenght > 50) {
			this.sendMessage(`Could not change category name; given category name is too long, max. 50 characters`);
			return;
		}

		if (!this.serverConfig.selfAssign.categoryExists(oldName)) {
			this.sendMessage(`Could not change category name; category \`\`${firstLetterUppercase(oldName)}\`\` does not exist`);
			return;
		}

		if (this.serverConfig.selfAssign.categoryExists(newName)) {
			this.sendMessage(`Could not change category name; category \`\`${firstLetterUppercase(newName)}\`\` already exists`);
			return;
		}

		this.serverConfig.selfAssign.changeCategoryName(oldName, newName);
		this.serverConfig.saveConfig();

		this.sendMessage(`Category \`\`${firstLetterUppercase(oldName)}\`\` changed to \`\`${firstLetterUppercase(newName)}\`\``);
	}
}