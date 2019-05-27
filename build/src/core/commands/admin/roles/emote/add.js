"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const emote_1 = require("./emote");
const functions_1 = require("../../../../functions");
const global_config_1 = require("../../../../../global-config");
class AddEmoteCommand extends emote_1.EmoteCommand {
    async runCommand() {
        this.loadInput();
        const roleName = this.input.ROLE || this.input.R;
        const categoryName = this.input.CATEGORY || this.input.C;
        let emote = this.input.EMOTE || this.input.E;
        const customEmoteName = this.input.EMOTENAME || this.input.EN;
        const messageLink = this.args.find(a => a.startsWith('HTTPS://DISCORDAPP.COM/CHANNELS/')).replace('HTTPS://DISCORDAPP.COM/CHANNELS/', '').split('/') || null;
        if (!roleName) {
            this.sendMessage('Could not add reaction role assignment; no role was given');
            return;
        }
        if (!messageLink) {
            this.sendMessage('Could not add reaction role assignment; no message link was given');
            return;
        }
        if (!emote) {
            this.sendMessage('Could not add reaction role assignment; no emote was given');
            return;
        }
        if (!categoryName) {
            this.sendMessage('Could not add reaction role assignment; no category was given');
            return;
        }
        if (!this.serverConfig.selfAssign.categoryExists(categoryName)) {
            this.sendMessage(`Could not add reaction role assignment; category \`\`${categoryName}\`\` does not exist`);
            return;
        }
        if (messageLink.length !== 3) {
            this.sendMessage('Could not add reaction role assignment; invalid message url');
            return;
        }
        const guildId = messageLink[0];
        if (guildId !== this.message.guild.id) {
            this.sendMessage('Could not add reaction role assignment; message is not on this guild');
            return;
        }
        const channelId = messageLink[1];
        const channel = this.message.guild.channels.find(c => c.id === channelId);
        if (!channel) {
            this.sendMessage('Could not add reaction role assignment; invalid channel, possibly lacking permissions');
            return;
        }
        const messageId = messageLink[2];
        const message = await channel.fetchMessage(messageId);
        if (!message) {
            this.sendMessage('Could not add reaction role assignment; invalid message');
            return;
        }
        if (message.reactions.size > 19) {
            this.sendMessage('Could not add reaction role assignment; too many reacts on this message');
            return;
        }
        const role = await this.message.guild.roles.find(r => r.name.toUpperCase() === roleName);
        if (!role) {
            this.sendMessage(`Could not add reaction role assignment; role \`\`${functions_1.firstLetterUppercase(roleName)}\`\` does not exist`);
            return;
        }
        if (!this.serverConfig.selfAssign.roleIsInCategory(categoryName, role.id)) {
            this.sendMessage(`Could not add reaction role assignment; role \`\`${role.name}\`\` is not in category \`\`${functions_1.firstLetterUppercase(categoryName)}\`\``);
            return;
        }
        const react = await this.emoteValidate(emote, customEmoteName);
        const reactIdentifier = react instanceof discord_js_1.Emoji ? react.identifier.toUpperCase() : react;
        if (!react) {
            this.sendMessage(`Could not add reaction role assignment; emote \`\`${functions_1.firstLetterUppercase(emote)}\`\` is invalid`);
            return;
        }
        if (this.serverConfig.selfAssign.emoteExists(messageId, reactIdentifier)) {
            this.sendMessage('Could not add reaction role assignment; there already is a role configured for this emote on the specified message');
            return;
        }
        if (react) {
            message.react(react).then(e => {
                this.serverConfig.selfAssign.addEmote(categoryName, role.id, messageId, channelId, reactIdentifier);
                this.serverConfig.saveConfig();
                this.sendMessage('Reaction role added');
                const botGuild = this.client.guilds.find(g => g.id === global_config_1.GlobalConfig.devServer);
                if (botGuild.emojis.find(e => e.id === react['id'])) {
                    botGuild.deleteEmoji(react);
                }
            });
        }
    }
}
exports.AddEmoteCommand = AddEmoteCommand;
