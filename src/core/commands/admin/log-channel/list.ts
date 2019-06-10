import { AdminCommand } from "../_admin";
import { BaseCommandInterface } from "../../../base-command";

export class ListLogChannelCommand extends AdminCommand implements BaseCommandInterface {
	runCommand() {
		if (this.serverConfig.logChannel) {
			this.sendMessage(`The current log channel is <#${this.serverConfig.logChannel}>`);
			return;
		}

		this.sendMessage('No log channel is currently set');
	}
}