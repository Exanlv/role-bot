import { BaseCommand, IBaseCommand } from '@classes/base-command';
import { List } from '@classes/list';
import { ListValue } from '@classes/list-value';
import { GuildChannel } from 'discord.js';

export class ListActiveChannelCommand extends BaseCommand implements IBaseCommand {
	public static description: string = 'Lists active channels';

	public runCommand(): void {
		const listValue = new ListValue();
		listValue.title = 'Active Channels';

		this.serverConfig.activeChannels.forEach((activeChannel: string) => {
			const guildChannel = this.message.guild.channels.find((c: GuildChannel) => c.id === activeChannel);

			if (!guildChannel) {
				this.serverConfig.removeActiveChannel(activeChannel);
			}

			listValue.values.push(`- ${guildChannel.name}`);
		});

		if (!listValue.values.length) {
			this.sendMessage('There are no active channels');
			return;
		}

		const list = new List();
		list.values.push(listValue);

		this.sendList(list);
	}
}
