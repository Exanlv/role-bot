import { BaseCommandInterface, BaseCommand } from "../../base-command";

export class HelpCommand extends BaseCommand implements BaseCommandInterface {
	public runCommand() {
		this.sendMessage('For a list of commands, please refer to the setup guide.\nhttps://landviz.nl/host/role-bot-setup.pdf');
	}
}