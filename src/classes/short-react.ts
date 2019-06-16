import { Guild, GuildMember } from 'discord.js';

export class ShortReact {
	public guild: Guild;
	public messageId: string;
	public emoteIdentifier: string;
	public member: GuildMember;
}
