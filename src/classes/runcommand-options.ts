import { TextChannel } from 'discord.js';

export class RunCommandOptions {
	public response?: string;
	public channel?: TextChannel;
	public time?: number;
	public caseSensitive?: boolean;
}
