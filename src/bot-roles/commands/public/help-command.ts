import { BaseCommandInterface } from "@classes/base-command";
import { GeneralHelpCommand } from "@bot-roles/commands/help-command";

export class PublicHelpCommand extends GeneralHelpCommand implements BaseCommandInterface {
	public static description: string = 'Brings up this menu';

	public runCommand() {
		super.runCommand('public');
	}
} 