import { BaseCommandInterface, BaseCommand } from "../../../base-command";
import { ListValue } from "../../../../shared/classes/list-value";
import { List } from "../../../../shared/classes/list";

export class ListActiveChannelCommand extends BaseCommand implements BaseCommandInterface {
	public runCommand() {
		const listValue = new ListValue;
		listValue.title = 'Active Channels';

		this.serverConfig.activeChannels.forEach(activeChannel => {
			let guildChannel = this.message.guild.channels.find(c => c.id === activeChannel);

			if (!guildChannel) {
				this.serverConfig.removeActiveChannel(activeChannel);
			}

			listValue.values.push(`- ${guildChannel.name}`);
		});

		if (!listValue.values.length) {
			this.sendMessage('There are no active channels');
			return;
		}

		const list = new List;
		list.values.push(listValue)

		this.sendList(list);
	}
}