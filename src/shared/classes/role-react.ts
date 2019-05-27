export class RoleReact {
	public emote: string;
	public messageId: string;
	public channelId: string;

	constructor(emote: string, messageId: string, channelId: string) {
		this.emote = emote;
		this.messageId = messageId;
		this.channelId = channelId;
	}
}