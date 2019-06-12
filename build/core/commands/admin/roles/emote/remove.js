"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../../_admin");
const functions_1 = require("../../../../functions");
class RemoveEmoteCommand extends _admin_1.AdminCommand {
    async runCommand() {
        this.loadInput();
        const category = this.input.CATEGORY || this.input.C || await this.getUserInput('``> enter category name``');
        if (!category) {
            this.sendMessage('Could not remove reaction role assignment; no category was given');
            return;
        }
        if (!this.serverConfig.selfAssign.categoryExists(category)) {
            this.sendMessage(`Could not remove reaction role assignment; category \`\`${functions_1.firstLetterUppercase(category)}\`\` does not exist`);
            return;
        }
        const role = this.input.ROLE || this.input.R || await this.getUserInput('``> enter role name``');
        if (!role) {
            this.sendMessage('Could not remove reaction role assignment; no role was given');
            return;
        }
        const guildRole = this.message.guild.roles.find(r => r.name.toUpperCase() === role);
        if (!guildRole) {
            this.sendMessage(`Could not remove reaction role assignment; role \`\`${functions_1.firstLetterUppercase(role)}\`\` does not exist`);
            return;
        }
        if (!this.serverConfig.selfAssign.roleIsInCategory(category, guildRole.id)) {
            this.sendMessage(`Could not remove reaction role assignment; role \`\`${guildRole.name}\`\` is not in category \`\`${functions_1.firstLetterUppercase(category)}\`\``);
            return;
        }
        const userInputToRemove = ((this.input.REMOVE || this.input.RM || await this.getUserInput('``> enter indexes to remove``')) || '').split(' ');
        const toRemove = [];
        // console.log(toRemove);
        for (let i = 0; i < userInputToRemove.length; i++) {
            if (userInputToRemove[i] !== '' && Number(userInputToRemove[i]) !== NaN) {
                toRemove.push(Number(userInputToRemove[i]));
            }
        }
        if (!toRemove.length) {
            this.sendMessage('Could not remove reaction role assignment; no numbers of reacts to remove were given');
            return;
        }
        const messageReactionsToRemove = this.serverConfig.selfAssign.removeEmotes(category, guildRole.id, toRemove);
        await messageReactionsToRemove.forEach(async (conf) => {
            const channel = this.message.guild.channels.find(c => c.id === conf.channelId);
            const message = await channel.fetchMessage(conf.messageId);
            await conf.reactions.forEach(async (reaction) => {
                const messageReaction = message.reactions.find(e => (e.emoji.id ? e.emoji.identifier.toUpperCase() : e.emoji.name) === reaction.emoteIdentifier);
                if (messageReaction) {
                    await messageReaction.remove();
                }
            });
        });
        this.sendMessage(`Succesfully removed react(s) \`\`${toRemove.join(', ')}\`\` from \`\`${guildRole.name}\`\` in category \`\`${functions_1.firstLetterUppercase(category)}\`\``);
    }
}
exports.RemoveEmoteCommand = RemoveEmoteCommand;
