"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageReactionsConfig {
    constructor() {
        this.channelId = null;
        this.messageId = null;
        this.reactions = [];
    }
}
exports.MessageReactionsConfig = MessageReactionsConfig;
class ReactionConf {
    constructor(emoteIdentifier, roleId) {
        this.emoteIdentifier = emoteIdentifier;
        this.roleId = roleId;
    }
}
exports.ReactionConf = ReactionConf;
