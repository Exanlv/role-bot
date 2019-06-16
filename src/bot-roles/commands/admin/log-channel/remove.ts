import { BaseCommandInterface, BaseCommand } from "@classes/base-command";

export class RemoveLogChannelCommand extends BaseCommand implements BaseCommandInterface {
	public static description: string = 'Unsets the log channel';

	runCommand() {
		const logChannel = this.serverConfig.logChannel;
		this.serverConfig.setLogChannel(null);

		this.sendMessage(`Succesfully removed <#${logChannel}> as log channel`);
	}
}