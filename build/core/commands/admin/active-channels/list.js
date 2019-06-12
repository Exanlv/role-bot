"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../_admin");
const list_value_1 = require("../../../../shared/classes/list-value");
const list_1 = require("../../../../shared/classes/list");
class ListActiveChannelCommand extends _admin_1.AdminCommand {
    runCommand() {
        const listValue = new list_value_1.ListValue;
        listValue.title = 'Active Channels';
        this.serverConfig.activeChannels.forEach(activeChannel => {
            let guildChannel = this.message.guild.channels.find(c => c.id === activeChannel);
            if (!guildChannel) {
                this.serverConfig.removeActiveChannel(activeChannel);
            }
            listValue.values.push(`- ${guildChannel.name}`);
        });
        if (!listValue.values.length) {
            this.sendMessage('There are no active channels');
            return;
        }
        const list = new list_1.List;
        list.values.push(listValue);
        this.sendList(list);
    }
}
exports.ListActiveChannelCommand = ListActiveChannelCommand;
