import { BaseCommand, IBaseCommand } from '@classes/base-command';

export class PrefixCommand extends BaseCommand implements IBaseCommand {
	public static description: string = 'Lists the current prefix used for public commands';

	public runCommand(): void {
		this.sendMessage(`Current prefix for ${this.message.guild.name}: \`\`${this.serverConfig.prefix}\`\``);
	}
}
