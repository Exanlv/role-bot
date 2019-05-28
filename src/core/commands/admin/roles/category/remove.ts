import { AdminCommand } from "../../_admin";
import { BaseCommandInterface } from "../../../../base-command";
import { firstLetterUppercase } from "../../../../functions";

export class RemoveCategoryCommand extends AdminCommand implements BaseCommandInterface {
    public async runCommand() {
        const categoryName = this.args.join(' ') || await this.getUserInput('`> enter the name of the category you want to delete`');

		if (!categoryName) {
			this.sendMessage('Could not remove category; no category name was given');
			return;
		}

		if (!this.serverConfig.selfAssign.categoryExists(categoryName)) {
			this.sendMessage(`Could not remove category; category \`\`${firstLetterUppercase(categoryName)}\`\` does not exist`);
			return;
		}

		this.serverConfig.selfAssign.removeCategory(categoryName);
		this.sendMessage(`Removed category \`\`${firstLetterUppercase(categoryName)}\`\``);
		this.serverConfig.saveConfig();
    }
}