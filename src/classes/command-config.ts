export class CommandConfig {
	public key: Array<string>;
	public commandClass: any;
	public subCommands?: Array<CommandConfig>;

	constructor(key: Array<string>, commandClass: any, subCommands: Array<CommandConfig> = null) {
		this.key = key;
		this.commandClass = commandClass;
		this.subCommands = subCommands;
	}

	public getSubCommand(key: string) {
		return this.subCommands.find(c => c.key.includes(key)) || false;
	}
}