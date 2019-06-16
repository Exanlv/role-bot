import { BaseCommandInterface } from "@classes/base-command";
import { GeneralHelpCommand } from "@bot-roles/commands/help-command";

export class AdminHelpCommand extends GeneralHelpCommand implements BaseCommandInterface {
	public runCommand() {
		super.runCommand('admin');
	}
}