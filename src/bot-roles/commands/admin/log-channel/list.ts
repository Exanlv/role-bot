import { BaseCommandInterface, BaseCommand } from "@classes/base-command";

export class ListLogChannelCommand extends BaseCommand implements BaseCommandInterface {
	public static description: string = 'Lists the current log channel';

	runCommand() {
		if (this.serverConfig.logChannel) {
			this.sendMessage(`The current log channel is <#${this.serverConfig.logChannel}>`);
			return;
		}

		this.sendMessage('No log channel is currently set');
	}
}