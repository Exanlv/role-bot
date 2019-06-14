import { BaseCommandInterface, BaseCommand } from "../../../../base-command";
import { firstLetterUppercase } from "../../../../functions";

export class AddCategoryCommand extends BaseCommand implements BaseCommandInterface {
    public async runCommand() {
		const categoryName = this.args.join(' ') || await this.getUserInput('``> enter a name for the category you want to create``');

		if (!categoryName) {
			this.sendMessage('Could not add category; no category name was given');
			return;
		}

		if(categoryName.length > 50) {
			this.sendMessage('Could not add category; given category name is too long, max. 50 characters');
			return;
		}

		if (this.serverConfig.selfAssign.categoryExists(categoryName)) {
			this.sendMessage(`Could not add category; category \`\`${firstLetterUppercase(categoryName)}\`\` already exists`);
			return;
		}

		this.serverConfig.selfAssign.addCategory(categoryName);
		this.sendMessage(`Added category \`\`${firstLetterUppercase(categoryName)}\`\``);
    }
}