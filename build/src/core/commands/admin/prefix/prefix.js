"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../_admin");
class PrefixCommand extends _admin_1.AdminCommand {
    runCommand() {
        this.sendMessage(`Current prefix for ${this.message.guild.name}: \`\`${this.serverConfig.prefix}\`\``);
    }
}
exports.PrefixCommand = PrefixCommand;
