import { GeneralHelpCommand } from '@bot-roles/commands/help-command';
import { IBaseCommand } from '@classes/base-command';

export class PublicHelpCommand extends GeneralHelpCommand implements IBaseCommand {
	public static description: string = 'Brings up this menu';

	public runCommand(): void {
		super.runCommand('public');
	}
}
