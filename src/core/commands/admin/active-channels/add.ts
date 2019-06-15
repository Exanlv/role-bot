import { BaseCommandInterface, BaseCommand } from "../../../base-command";

export class AddActiveChannelCommand extends BaseCommand implements BaseCommandInterface {
	public static description: string = 'Adds an active channel';

	public runCommand() {
		const channel = this.message.mentions.channels.first();

		if (!channel) {
			this.sendMessage('Could not add channel as active channel; this channel does not exist');
			return;
		}

		if (this.serverConfig.isActiveChannel(channel.id)) {
			this.sendMessage('Could not add channel as active channel; this channel already is an active channel');
			return;
		}

		this.serverConfig.addActiveChannel(channel.id);
		this.sendMessage(`Added channel \`\`${channel.name}\`\` as active channel`);
	}
}