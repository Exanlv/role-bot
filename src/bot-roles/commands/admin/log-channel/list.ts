import { BaseCommand, IBaseCommand } from '@classes/base-command';

export class ListLogChannelCommand extends BaseCommand implements IBaseCommand {
	public static description: string = 'Lists the current log channel';

	public runCommand(): void {
		if (this.serverConfig.logChannel) {
			this.sendMessage(`The current log channel is <#${this.serverConfig.logChannel}>`);
			return;
		}

		this.sendMessage('No log channel is currently set');
	}
}
