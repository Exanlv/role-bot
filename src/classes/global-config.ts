import { Guild } from 'discord.js';

export class GlobalConfig {
	public accentColor: string;
	public dev: boolean;
	public developers: string[];
	public prefixes: {['admin']: string, ['dev']: string};
	public devServerId: string;
	public devServer?: Guild;
}
