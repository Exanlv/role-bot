import { BaseCommand, IBaseCommand } from '@classes/base-command';

export class RemoveLogChannelCommand extends BaseCommand implements IBaseCommand {
	public static description: string = 'Unsets the log channel';

	public runCommand(): void {
		const logChannel = this.serverConfig.logChannel;
		this.serverConfig.setLogChannel(null);

		this.sendMessage(`Succesfully removed <#${logChannel}> as log channel`);
	}
}
