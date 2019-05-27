import { AdminCommand } from "../_admin";
import { BaseCommandInterface } from "../../../base-command";
import { GlobalConfig } from "../../../../global-config";

export class SetPrefixCommand extends AdminCommand implements BaseCommandInterface {
	public runCommand() {
		this.loadInput(false);

		const prefix = this.input.PREFIX || this.input.P;

		if (!prefix) {
			this.sendMessage('Could not set prefix; no prefix was given');
			return;
		}

		if (prefix === GlobalConfig.adminPrefix || prefix === GlobalConfig.developerPrefix) {
			this.sendMessage('Could not set prefix; this prefix can not be used');
			return;
		}

		if (prefix.length > 25) {
			this.sendMessage('Could not set prefix; given prefix is too long');
			return;
		}

		this.serverConfig.setPrefix(prefix);
		this.sendMessage('Prefix set!');
	}
}