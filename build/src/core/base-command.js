"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const server_config_1 = require("./server-config");
const global_config_1 = require("../global-config");
const command_configs_1 = require("./command-configs");
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
        const regex = / ([A-Z]*?):{(.*?)}/;
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
}
exports.BaseCommand = BaseCommand;
async function handleMessage(message, client, prefixes) {
    if (message.author.bot || !message.guild) {
        return;
    }
    const serverConfig = new server_config_1.ServerConfig(message.guild.id);
    if (serverConfig.activeChannels.length && !serverConfig.activeChannels.includes(message.channel.id)) {
        return;
    }
    let command = message.content.toUpperCase();
    let mode;
    if (command.startsWith(prefixes.dev)) {
        if (!global_config_1.GlobalConfig.developers.includes(message.member.id)) {
            return;
        }
        mode = 'dev';
    }
    else if (command.startsWith(prefixes.admin)) {
        let confirmedAdmin = false;
        if (global_config_1.GlobalConfig.developers.includes(message.member.id) || message.member.hasPermission('ADMINISTRATOR')) {
            confirmedAdmin = true;
        }
        for (let i = 0; i < serverConfig.adminRoles.length && !confirmedAdmin; i++) {
            if (message.member.roles.some((memberRole) => { return memberRole.id === serverConfig.adminRoles[i]; })) {
                confirmedAdmin = true;
            }
        }
        if (!confirmedAdmin) {
            return;
        }
        mode = 'admin';
    }
    else if (command.startsWith(serverConfig.prefix)) {
        mode = 'public';
    }
    else {
        return;
    }
    const prefix = { admin: prefixes.admin, public: serverConfig.prefix, dev: prefixes.dev }[mode];
    command = removePrefix(command, prefix);
    const args = command.split(' ');
    const CommandConfig = command_configs_1.getCommandConfig(mode, args);
    if (!CommandConfig) {
        message.channel.send(`Invalid command! Use \`\`${prefix}help\`\` for a list of commands`);
        return;
    }
    const classFile = await Promise.resolve().then(() => require(`./commands/${mode}/${CommandConfig.filePath}`)).catch(console.error);
    if (!classFile)
        return;
    if (!classFile[CommandConfig.className]) {
        console.error(`Class ${CommandConfig.className} does not exist in ${mode}/${CommandConfig.filePath}`);
        return;
    }
    const commandInstance = new classFile[CommandConfig.className](message, serverConfig, command, args, client);
    commandInstance.runCommand();
}
exports.handleMessage = handleMessage;
function removePrefix(message, prefix) {
    return message.replace(prefix, '');
}
