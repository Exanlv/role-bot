"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const global_config_1 = require("../global-config");
class BaseCommand {
    constructor(message, serverConfig, command, args, client) {
        this.input = {};
        this.serverConfig = serverConfig;
        this.message = message;
        this.command = command;
        this.args = args;
        this.client = client;
    }
    loadInput(trim = true) {
        let input = ` ${this.args.join(' ')}`;
        const regex = / ([A-Z|0-9]*?):{(.*?)}/;
        const matches = [];
        let cont = true;
        while (cont) {
            let newValue = regex.exec(input);
            if (newValue) {
                matches.push(newValue);
                input = input.substring(input.indexOf(newValue[0]) + newValue[0].length);
            }
            else {
                cont = false;
            }
        }
        matches.forEach(match => {
            this.input[match[1]] = trim ? match[2].trim() : match[2];
        });
    }
    sendList(list, includeEmpty = true) {
        const embed = new discord_js_1.RichEmbed()
            .setColor(list.color);
        if (list.title) {
            embed.setTitle(list.title);
            embed.addBlankField();
        }
        list.values.forEach((listValue, i) => {
            embed.addField(listValue.title, listValue.values.join('\n') + '\n\n', includeEmpty);
            if (((i + 1 !== list.values.length) || list.values.length === 1) && includeEmpty)
                embed.addBlankField(true);
        });
        if (list.thumbnail)
            embed.setThumbnail(list.thumbnail);
        this.message.channel.send(embed)
            .catch(e => { this.handleError(e, 'SendList'); });
    }
    handleError(error, id) {
        if (error.message === 'Missing Permissions') {
            let errorMessage;
            switch (id) {
                case 'SendList':
                case 'SendMessage':
                    errorMessage = 'Missing permissions to send messages/embeds';
                    break;
                case 'HandleRoles':
                    errorMessage = 'Missing permissions to handle roles';
                    break;
                case 'ApplyReact':
                    errorMessage = 'Missing permissions to apply reacts';
                    break;
                case 'ReactManage':
                    errorMessage = 'Missing permissions to moderate reacts';
                    break;
            }
            if (errorMessage) {
                let channel = this.message.channel;
                let message = `Hey! There is an issue with bot permissions on your guild \`\`${this.message.guild.name}\`\`\n\n\`\`\`${errorMessage}\`\`\``;
                message += `\`\`\`Channel: ${channel.name}, ${channel.id}\nCommand: ${this.command}\nUser: ${this.message.author.tag}, ${this.message.author.id}\`\`\`\n\n`;
                const sendActiveChannelReminder = ['SendList', 'SendMessage'];
                if (sendActiveChannelReminder.includes(id))
                    message += `If you don't want the bot to be active in this channel, please use \`\`${global_config_1.GlobalConfig.adminPrefix}active-channels\`\` to set up active channels.`;
                this.message.guild.owner.send(message)
                    .catch(e => { });
                return;
            }
        }
        const guild = this.client.guilds.find(server => server.id === global_config_1.GlobalConfig.devServer);
        if (!guild) {
            return;
        }
        const errorChannel = guild.channels.find(c => c.name === 'errors');
        if (!errorChannel) {
            return;
        }
        errorChannel.send(`\`\`${id}\`\` caused error \`\`${error.message}\`\``);
    }
    sendMessage(message) {
        this.message.channel.send(message)
            .catch(e => {
            this.handleError(e, 'SendMessage');
        });
    }
    async getUserInput(message) {
        this.sendMessage(message);
        const reply = await this.message.channel.awaitMessages(m => m.author.id === this.message.author.id, { maxMatches: 1, time: 20000 });
        if (reply.first() && reply.first().content.toUpperCase() !== '~~EXIT') {
            return reply.first().content.toUpperCase();
        }
        return false;
    }
}
exports.BaseCommand = BaseCommand;
