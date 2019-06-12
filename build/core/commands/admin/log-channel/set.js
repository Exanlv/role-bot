"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../_admin");
class SetLogChannelCommand extends _admin_1.AdminCommand {
    runCommand() {
        const channel = this.message.mentions.channels.first();
        if (!channel) {
            this.sendMessage('Could not set log channel; no channel was given');
            return;
        }
        if (channel.id === this.serverConfig.logChannel) {
            this.sendMessage(`Could not set log channel; <#${this.serverConfig.logChannel}> already is the log channel`);
            return;
        }
        this.serverConfig.setLogChannel(channel.id);
        this.sendMessage(`Succesfully set <#${this.serverConfig.logChannel}> as log channel!`);
    }
}
exports.SetLogChannelCommand = SetLogChannelCommand;
