"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../../_admin");
const functions_1 = require("../../../../functions");
class RemoveEmoteCommand extends _admin_1.AdminCommand {
    runCommand() {
        this.loadInput();
        const category = this.input.CATEGORY || this.input.C;
        const role = this.input.ROLE || this.input.R;
        const toRemove = (this.input.REMOVE || this.input.RM).split(' ');
        if (!category) {
            this.sendMessage('Could not remove reaction role assignment; no category was given');
            return;
        }
        if (!role) {
            this.sendMessage('Could not remove reaction role assignment; no role was given');
            return;
        }
        if (!toRemove.length) {
            this.sendMessage('Could not remove reaction role assignment; no numbers of reacts to remove were given');
            return;
        }
        if (!this.serverConfig.selfAssign.categoryExists(category)) {
            this.sendMessage(`Could not remove reaction role assignment; category \`\`${functions_1.firstLetterUppercase(category)}\`\` does not exist`);
            return;
        }
        const guildRole = this.message.guild.roles.find(r => r.name.toUpperCase() === role);
        if (!guildRole) {
            this.sendMessage(`Could not remove reaction role assignment; role \`\`${role}\`\` does not exist`);
            return;
        }
        if (!this.serverConfig.selfAssign.roleIsInCategory(category, guildRole.id)) {
            this.sendMessage(`Could not remove reaction role assignment; role \`\`${guildRole.name}\`\` is not in category \`\`${functions_1.firstLetterUppercase(category)}\`\``);
            return;
        }
        const messageReactionsToRemove = this.serverConfig.selfAssign.removeEmotes(category, guildRole.id, toRemove);
        this.serverConfig.saveConfig();
        messageReactionsToRemove.forEach(async (conf) => {
            const channel = this.message.guild.channels.find(c => c.id === conf.channelId);
            const message = await channel.fetchMessage(conf.messageId);
            conf.reactions.forEach(reaction => {
                const messageReaction = message.reactions.find(e => (e.emoji.id ? e.emoji.identifier.toUpperCase() : e.emoji.name) === reaction.emoteIdentifier);
                if (messageReaction) {
                    messageReaction.remove();
                }
            });
        });
        this.sendMessage(`Succesfully removed reacts \`\`${toRemove.join(', ')}\`\` from \`\`${guildRole.name}\`\` in category \`\`${category}\`\``);
    }
}
exports.RemoveEmoteCommand = RemoveEmoteCommand;
