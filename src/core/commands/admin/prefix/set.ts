import { BaseCommandInterface, BaseCommand } from "../../../base-command";

export class SetPrefixCommand extends BaseCommand implements BaseCommandInterface {
	public runCommand() {
		this.loadInput(false);

		const prefix = this.input.PREFIX || this.input.P;

		if (!prefix) {
			this.sendMessage('Could not set prefix; no prefix was given');
			return;
		}

		if (prefix === this.globalConfig.prefixes.admin || prefix === this.globalConfig.prefixes.dev) {
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