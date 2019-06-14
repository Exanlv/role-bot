import { BaseCommandInterface, BaseCommand } from "../../../base-command";

export class RemoveLogChannelCommand extends BaseCommand implements BaseCommandInterface {
	runCommand() {
		const logChannel = this.serverConfig.logChannel;
		this.serverConfig.setLogChannel(null);

		this.sendMessage(`Succesfully removed <#${logChannel}> as log channel`);
	}
}