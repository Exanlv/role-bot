"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../_admin");
class RemoveActiveChannelCommand extends _admin_1.AdminCommand {
    runCommand() {
        const channel = this.message.mentions.channels.first();
        if (!channel) {
            this.sendMessage('Could not remove channel from active channels; this channel does not exist');
            return;
        }
        if (!this.serverConfig.isActiveChannel(channel.id)) {
            this.sendMessage('Could not remove channel from active channels; this channel is not an active channel');
            return;
        }
        this.sendMessage(`Removed channel \`\`${channel.name}\`\` from active channels`);
        this.serverConfig.removeActiveChannel(channel.id);
    }
}
exports.RemoveActiveChannelCommand = RemoveActiveChannelCommand;
