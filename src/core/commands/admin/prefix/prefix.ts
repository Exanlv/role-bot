import { AdminCommand } from "../_admin";
import { BaseCommandInterface } from "../../../base-command";

export class PrefixCommand extends AdminCommand implements BaseCommandInterface {
	public runCommand() {
		this.sendMessage(`Current prefix for ${this.message.guild.name}: \`\`${this.serverConfig.prefix}\`\``);
	}
}