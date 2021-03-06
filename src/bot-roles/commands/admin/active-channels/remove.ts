import { BaseCommand, IBaseCommand } from '@classes/base-command';

export class RemoveActiveChannelCommand extends BaseCommand implements IBaseCommand {
	public static description: string = 'Removes an active channel';

	public runCommand(): void {
		const channel = this.message.mentions.channels.first();

		if (!channel) {
			this.sendMessage('Could not remove channel from active channels; this channel does not exist');
			return;
		}

		if (!this.serverConfig.isActiveChannel(channel.id)) {
			this.sendMessage('Could not remove channel from active channels; this channel is not an active channel');
			return;
		}

		this.sendMessage(`Removed channel \`\`${channel.name}\`\` from active channels`);
		this.serverConfig.removeActiveChannel(channel.id);
	}
}
