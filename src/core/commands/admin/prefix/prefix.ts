import { BaseCommandInterface, BaseCommand } from "../../../base-command";

export class PrefixCommand extends BaseCommand implements BaseCommandInterface {
	public static description: string = 'Lists the current prefix used for public commands';

	public runCommand() {
		this.sendMessage(`Current prefix for ${this.message.guild.name}: \`\`${this.serverConfig.prefix}\`\``);
	}
}