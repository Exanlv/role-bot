export class MessageReactionsConfig {
	public channelId: string = null;
	public messageId: string = null;

	public reactions: Array<ReactionConf> = [];
}

export class ReactionConf {
	public emoteIdentifier: string;
	public roleId: string;

	constructor(emoteIdentifier, roleId) {
		this.emoteIdentifier = emoteIdentifier;
		this.roleId = roleId;
	}
}