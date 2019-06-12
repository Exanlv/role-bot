"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../_admin");
const global_config_1 = require("../../../../global-config");
class SetPrefixCommand extends _admin_1.AdminCommand {
    runCommand() {
        this.loadInput(false);
        const prefix = this.input.PREFIX || this.input.P;
        if (!prefix) {
            this.sendMessage('Could not set prefix; no prefix was given');
            return;
        }
        if (prefix === global_config_1.GlobalConfig.adminPrefix || prefix === global_config_1.GlobalConfig.developerPrefix) {
            this.sendMessage('Could not set prefix; this prefix can not be used');
            return;
        }
        if (prefix.length > 25) {
            this.sendMessage('Could not set prefix; given prefix is too long');
            return;
        }
        this.serverConfig.setPrefix(prefix);
        this.sendMessage('Prefix set!');
    }
}
exports.SetPrefixCommand = SetPrefixCommand;
