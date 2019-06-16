import { ReactionConf } from '@classes/reaction-conf';

export class MessageReactionsConfig {
	public channelId: string = null;
	public messageId: string = null;

	public reactions: ReactionConf[] = [];
}
