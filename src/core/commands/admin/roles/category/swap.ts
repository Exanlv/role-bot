import { AdminCommand } from "../../_admin";
import { BaseCommandInterface } from "../../../../base-command";
import { firstLetterUppercase } from "../../../../functions";

export class CategorySwapCommand extends AdminCommand implements BaseCommandInterface {
	public async runCommand() {
		this.loadInput();

		const categoryOne = this.input.CATEGORY1 || this.input.C1 || await this.getUserInput('`> enter the name of the first category`');

		if (!categoryOne) {
			this.sendMessage('Could not swap categories; category 1 is missing');
			return;
		}

		if (!this.serverConfig.selfAssign.categoryExists(categoryOne)) {
			this.sendMessage(`Could not swap categories; category \`\`${firstLetterUppercase(categoryOne)}\`\` does not exist`);
			return;			
		}

		const categoryTwo = this.input.CATEGORY2 || this.input.C2 || await this.getUserInput('`> enter the name of the second category`');

		if (!categoryTwo) {
			this.sendMessage('Could not swap categories; category 2 is missing');
			return;
		}

		if (!this.serverConfig.selfAssign.categoryExists(categoryTwo)) {
			this.sendMessage(`Could not swap categories; category \`\`${firstLetterUppercase(categoryTwo)}\`\` does not exist`);
			return;			
		}

		this.serverConfig.selfAssign.swapCategories(this.serverConfig.selfAssign.getCategory(categoryOne), this.serverConfig.selfAssign.getCategory(categoryTwo));
		this.serverConfig.saveConfig();
		this.sendMessage(`Swapped categories \`\`${firstLetterUppercase(categoryOne)}\`\` and \`\`${firstLetterUppercase(categoryTwo)}\`\``);
	}
}