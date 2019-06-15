import { BaseCommandInterface } from "../../base-command";
import { GeneralHelpCommand } from "../help-command";

export class AdminHelpCommand extends GeneralHelpCommand implements BaseCommandInterface {
	public static description: string = 'Brings up this menu';

	public runCommand() {
		super.runCommand('admin');
	}
}