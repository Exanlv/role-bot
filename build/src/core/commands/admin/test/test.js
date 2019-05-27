"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../_admin");
class Test extends _admin_1.AdminCommand {
    runCommand() {
        this.sendMessage(`\`\`\`${JSON.stringify(this.serverConfig.selfAssign.getAllReactions())}\`\`\``);
    }
}
exports.Test = Test;
