"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandConfig {
    constructor(key, className, filePath, subCommands = null) {
        this.key = key;
        this.className = className;
        this.filePath = filePath;
        this.subCommands = subCommands;
    }
    getSubCommand(key) {
        return this.subCommands.find(c => c.key.includes(key)) || false;
    }
}
exports.CommandConfig = CommandConfig;
