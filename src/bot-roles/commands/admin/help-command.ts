import { GeneralHelpCommand } from '@bot-roles/commands/help-command';
import { IBaseCommand } from '@classes/base-command';

export class AdminHelpCommand extends GeneralHelpCommand implements IBaseCommand {
	public runCommand(): void {
		super.runCommand('admin');
	}
}
