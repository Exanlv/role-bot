import { AdminCommand } from "../_admin";
import { BaseCommandInterface } from "../../../base-command";

export class RemoveLogChannelCommand extends AdminCommand implements BaseCommandInterface {
	runCommand() {
		const logChannel = this.serverConfig.logChannel;
		this.serverConfig.setLogChannel(null);

		this.sendMessage(`Succesfully removed <#${logChannel}> as log channel`);
	}
}