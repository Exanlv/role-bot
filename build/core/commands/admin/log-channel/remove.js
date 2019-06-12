"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../_admin");
class RemoveLogChannelCommand extends _admin_1.AdminCommand {
    runCommand() {
        const logChannel = this.serverConfig.logChannel;
        this.serverConfig.setLogChannel(null);
        this.sendMessage(`Succesfully removed <#${logChannel}> as log channel`);
    }
}
exports.RemoveLogChannelCommand = RemoveLogChannelCommand;
