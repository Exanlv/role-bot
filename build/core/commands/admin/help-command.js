"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("./_admin");
class HelpCommand extends _admin_1.AdminCommand {
    runCommand() {
        this.sendMessage('For a list of commands, please refer to the setup guide.\nhttps://landviz.nl/host/role-bot-setup.pdf');
    }
}
exports.HelpCommand = HelpCommand;
