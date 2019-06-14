import { BaseCommandInterface, BaseCommand } from "../../../base-command";

export class PrefixCommand extends BaseCommand implements BaseCommandInterface {
	public runCommand() {
		this.sendMessage(`Current prefix for ${this.message.guild.name}: \`\`${this.serverConfig.prefix}\`\``);
	}
}