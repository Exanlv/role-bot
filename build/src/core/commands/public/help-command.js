"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _public_1 = require("./_public");
class HelpCommand extends _public_1.PublicCommand {
    runCommand() {
        let message = '```';
        message += `${this.serverConfig.prefix}roles - get a list of all available roles\n`;
        message += `${this.serverConfig.prefix}getrole (role) - get a role\n`;
        message += `${this.serverConfig.prefix}removerole (role) - remove a role\n`;
        message += '```';
        this.sendMessage(message);
    }
}
exports.HelpCommand = HelpCommand;
