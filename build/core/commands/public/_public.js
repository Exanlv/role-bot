"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_command_1 = require("../../base-command");
class PublicCommand extends base_command_1.BaseCommand {
    constructor(message, serverConfig, command, args, client) {
        super(message, serverConfig, command, args, client);
    }
}
exports.PublicCommand = PublicCommand;
