"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../_admin");
class ListLogChannelCommand extends _admin_1.AdminCommand {
    runCommand() {
        if (this.serverConfig.logChannel) {
            this.sendMessage(`The current log channel is <#${this.serverConfig.logChannel}>`);
            return;
        }
        this.sendMessage('No log channel is currently set');
    }
}
exports.ListLogChannelCommand = ListLogChannelCommand;
