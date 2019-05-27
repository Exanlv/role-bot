import { CommandConfig } from './command-config';

export class CommandConfigs {
	public readonly dev: Array<CommandConfig>;
	public readonly admin: Array<CommandConfig>;
	public readonly public: Array<CommandConfig>;
}