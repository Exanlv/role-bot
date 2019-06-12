"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../_admin");
class AddActiveChannelCommand extends _admin_1.AdminCommand {
    runCommand() {
        const channel = this.message.mentions.channels.first();
        if (!channel) {
            this.sendMessage('Could not add channel as active channel; this channel does not exist');
            return;
        }
        if (this.serverConfig.isActiveChannel(channel.id)) {
            this.sendMessage('Could not add channel as active channel; this channel already is an active channel');
            return;
        }
        this.serverConfig.addActiveChannel(channel.id);
        this.sendMessage(`Added channel \`\`${channel.name}\`\` as active channel`);
    }
}
exports.AddActiveChannelCommand = AddActiveChannelCommand;
