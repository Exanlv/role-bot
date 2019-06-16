export class CommandConfig {
	public key: string[];
	public commandClass: any;
	public subCommands?: CommandConfig[];

	constructor(key: string[], commandClass: any, subCommands: CommandConfig[] = null) {
		this.key = key;
		this.commandClass = commandClass;
		this.subCommands = subCommands;
	}

	public getSubCommand(key: string): CommandConfig|false {
		return this.subCommands.find((c: CommandConfig) => c.key.includes(key)) || false;
	}
}
