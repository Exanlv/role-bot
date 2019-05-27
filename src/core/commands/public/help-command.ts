import { PublicCommand } from "./_public";
import { BaseCommandInterface } from "../../base-command";

export class HelpCommand extends PublicCommand implements BaseCommandInterface {
	public runCommand() {
		let message = '```';
		message += `${this.serverConfig.prefix}roles - get a list of all available roles\n`;
		message += `${this.serverConfig.prefix}getrole (role) - get a role\n`;
		message += `${this.serverConfig.prefix}removerole (role) - remove a role\n`;
		message += '```'

		this.sendMessage(message);
	}
} 