export class CommandConfig {
	public key: Array<string>;
	public className: string;
	public filePath: string;
	public subCommands?: Array<CommandConfig>;

	constructor(key: Array<string>, className: string, filePath: string, subCommands: Array<CommandConfig> = null) {
		this.key = key;
		this.className = className;
		this.filePath = filePath;
		this.subCommands = subCommands;
	}

	public getSubCommand(key: string) {
		return this.subCommands.find(c => c.key.includes(key)) || false;
	}
}