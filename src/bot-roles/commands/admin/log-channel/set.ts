import { BaseCommandInterface, BaseCommand } from "@classes/base-command";

export class SetLogChannelCommand extends BaseCommand implements BaseCommandInterface {
	public static description: string = 'Sets the log channel';

	public runCommand() {
		const channel = this.message.mentions.channels.first();

		if (!channel) {
			this.sendMessage('Could not set log channel; no channel was given');
			return;
		}

		if (channel.id === this.serverConfig.logChannel) {
			this.sendMessage(`Could not set log channel; <#${this.serverConfig.logChannel}> already is the log channel`);
			return;
		}

		this.serverConfig.setLogChannel(channel.id);
		this.sendMessage(`Succesfully set <#${this.serverConfig.logChannel}> as log channel!`);
	}
}