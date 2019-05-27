"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../../_admin");
const global_config_1 = require("../../../../../global-config");
const emojiRegex = require('emoji-regex');
class EmoteCommand extends _admin_1.AdminCommand {
    async isDiscordEmoji(input) {
        let emoji;
        try {
            emoji = await this.message.react(input);
        }
        catch (err) {
            return false;
        }
        emoji.remove();
        return input;
    }
    async emoteValidate(input, customName = null) {
        if (await this.isDiscordEmoji(input)) {
            return input;
        }
        if (!input.startsWith('<:')) {
            return false;
        }
        input = input.substring(2, input.length - 1);
        console.log(input);
        const emoteSplit = input.split(':');
        if (emoteSplit.length < 2 || emoteSplit.length > 3) {
            return false;
        }
        if (emoteSplit.length === 2) {
            return await this.getEmote(emoteSplit.join(':'), customName);
        }
        if (emoteSplit.length === 3) {
            emoteSplit.push('A');
            emoteSplit.splice(0, 1);
            return await this.getEmote(emoteSplit.join(':'), customName);
        }
    }
    async getEmote(input, customName = null) {
        if (!customName) {
            let emote = this.client.emojis.find(e => e.identifier.toUpperCase() === input);
            if (emote) {
                return emote;
            }
        }
        const inputSplit = input.split(':');
        console.log(input);
        const botGuild = this.client.guilds.find(g => g.id === global_config_1.GlobalConfig.devServer);
        const emoteUrl = `https://cdn.discordapp.com/emojis/${inputSplit[1]}.${inputSplit[2] ? 'gif' : 'png'}`;
        console.log(emoteUrl);
        const emoteName = (customName || inputSplit[0]).toLowerCase();
        const emoji = await botGuild.createEmoji(emoteUrl, emoteName).catch(e => {
            this.handleError(e, 'UploadEmote');
        });
        if (!emoji) {
            return;
        }
        return emoji;
    }
}
exports.EmoteCommand = EmoteCommand;
