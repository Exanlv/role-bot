"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_command_1 = require("../../base-command");
class EvalCommand extends base_command_1.BaseCommand {
    runCommand() {
        const messageSplit = this.message.content.split(' ');
        messageSplit.splice(0, 2);
        const code = messageSplit.join(' ').trim().replace(/\`\`\`/g, '');
        try {
            eval(code);
        }
        catch (err) {
            this.message.member.send(err).catch(e => { });
        }
    }
}
exports.EvalCommand = EvalCommand;
