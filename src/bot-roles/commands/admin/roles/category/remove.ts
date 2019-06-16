import { BaseCommand, IBaseCommand } from '@classes/base-command';
import { firstLetterUppercase } from '@core/functions';

export class RemoveCategoryCommand extends BaseCommand implements IBaseCommand {
	public static description: string = 'Removes a role category';

	public async runCommand(): Promise<void> {
		const categoryName = this.args.join(' ') || await this.getUserInput('``> enter the name of the category you want to delete``');

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
	}
}
