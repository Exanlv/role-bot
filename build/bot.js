"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const global_config_1 = require("./global-config");
const server_config_1 = require("./core/server-config");
const short_react_1 = require("./shared/classes/short-react");
const command_configs_1 = require("./core/command-configs");
const events_1 = require("events");
class RoleBot extends events_1.EventEmitter {
    constructor(token, rootDir) {
        super();
        this.configs = {};
        this.prefixes = {};
        this.developerIds = [];
        this.client = new discord_js_1.Client();
        this.token = token;
        this.prefixes.dev = global_config_1.GlobalConfig.developerPrefix;
        this.prefixes.admin = global_config_1.GlobalConfig.adminPrefix;
        this.developerIds = global_config_1.GlobalConfig.developers;
        this.rootDir = rootDir;
        this.dataDir = `${this.rootDir}/data`;
        this.color = global_config_1.GlobalConfig.color;
        this.handleOnReady();
        this.handleOnError();
        this.login().then(() => {
            this.handleOnGuildCreate();
            this.handleOnGuildDelete();
            this.loadConfigs();
            this.handleOnMessage();
            this.handleOnRawMessageReacts();
            this.handleOnCustomReactAdd();
            this.handleOnCustomReactRemove();
            this.handleOnChannelDelete();
            this.handleOnRoleDelete();
            this.handleOnRawMessageDelete();
            this.handleOnGuildMemberAdd();
            this.handleOnCommand();
            this.emit('BotReady');
        });
    }
    async login() {
        await this.client.login(this.token);
    }
    addConfig(guildId) {
        if (!this.configs[guildId])
            this.configs[guildId] = new server_config_1.ServerConfig(guildId, `${this.dataDir}/configs`);
    }
    removeConfig(guildId, del = false) {
        if (del) {
            this.configs[guildId].delete();
        }
        if (this.configs[guildId])
            delete this.configs[guildId];
    }
    loadConfigs() {
        this.client.guilds.forEach(g => {
            this.addConfig(g.id);
        });
    }
    handleOnReady() {
        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}`);
        });
    }
    handleOnError() {
        this.client.on('error', error => {
            console.log(error);
        });
    }
    handleOnMessage() {
        this.client.on('message', async (message) => {
            if (message.author.id === this.client.user.id || !message.guild) {
                return;
            }
            const config = this.configs[message.guild.id];
            if (config.activeChannels.length && !config.activeChannels.includes(message.channel.id)) {
                return;
            }
            const rawMessage = message.cleanContent.toUpperCase();
            let mode;
            if (rawMessage.startsWith(this.prefixes.dev)) {
                if (!this.developerIds.includes(message.member.id)) {
                    return;
                }
                mode = 'dev';
            }
            else if (rawMessage.startsWith(this.prefixes.admin)) {
                let confirmedAdmin = false;
                if (this.developerIds.includes(message.member.id) || message.member.hasPermission('ADMINISTRATOR')) {
                    confirmedAdmin = true;
                }
                for (let i = 0; i < config.adminRoles.length; i++) {
                    if (message.member.roles.find(r => r.id === config.adminRoles[i])) {
                        confirmedAdmin = true;
                        break;
                    }
                }
                if (!confirmedAdmin) {
                    return;
                }
                mode = 'admin';
            }
            else if (rawMessage.startsWith(config.prefix)) {
                mode = 'public';
            }
            else {
                return;
            }
            const prefix = { dev: this.prefixes.dev, admin: this.prefixes.admin, public: config.prefix }[mode];
            const command = rawMessage.replace(prefix, '');
            const args = command.split(' ');
            this.client.emit('command', message);
            const commandConfig = command_configs_1.getCommandConfig(mode, args);
            if (!commandConfig) {
                message.channel.send(`Invalid command! Use \`\`${prefix}help\`\` for a list of commands`);
                return;
            }
            const classFile = await Promise.resolve().then(() => require(`./core/commands/${mode}/${commandConfig.filePath}`)).catch(console.error);
            if (!classFile)
                return;
            if (!classFile[commandConfig.className]) {
                console.error(`Class ${commandConfig.className} does not exist in ${mode}/${commandConfig.filePath}.ts`);
                return;
            }
            const commandInstance = new classFile[commandConfig.className](message, config, command, args, this.client);
            commandInstance.runCommand();
        });
    }
    handleOnGuildCreate() {
        this.client.on('guildCreate', (guild) => {
            this.addConfig(guild.id);
        });
    }
    handleOnGuildDelete() {
        this.client.on('guildDelete', (guild) => {
            this.removeConfig(guild.id, true);
        });
    }
    handleOnRawMessageReacts() {
        const events = {
            MESSAGE_REACTION_ADD: 'CustomReactAdd',
            MESSAGE_REACTION_REMOVE: 'CustomReactRemove'
        };
        this.client.on('raw', async (event) => {
            if (!events.hasOwnProperty(event.t))
                return;
            const shortReact = new short_react_1.ShortReact;
            if (!event.d.guild_id) {
                return;
            }
            shortReact.guild = this.client.guilds.find(g => g.id === event.d.guild_id);
            shortReact.member = shortReact.guild.members.find(m => m.id === event.d.user_id);
            shortReact.messageId = event.d.message_id;
            shortReact.emoteIdentifier = event.d.emoji.id ? `${event.d.emoji.name.split('~')[0]}:${event.d.emoji.id}` : event.d.emoji.name;
            this.client.emit(events[event.t], shortReact);
        });
    }
    handleOnCustomReactAdd() {
        this.client.on('CustomReactAdd', (reaction) => {
            if (reaction.member.id === this.client.user.id) {
                return;
            }
            const config = this.configs[reaction.guild.id];
            const reactRole = config.selfAssign.getReactRole(reaction.messageId, reaction.emoteIdentifier.toUpperCase());
            if (!reactRole) {
                return;
            }
            const guildRole = reaction.guild.roles.find(r => r.id === reactRole);
            if (!guildRole) {
                config.selfAssign.handleRemovedRole(reactRole);
                return;
            }
            reaction.member.addRole(guildRole).catch(e => {
                // this.handleError
            });
        });
    }
    handleOnCustomReactRemove() {
        this.client.on('CustomReactRemove', (reaction) => {
            const config = this.configs[reaction.guild.id];
            if (reaction.member.id === this.client.user.id) {
                config.selfAssign.handleReactionRemove(reaction.emoteIdentifier.toUpperCase(), reaction.messageId);
                return;
            }
            const reactRole = config.selfAssign.getReactRole(reaction.messageId, reaction.emoteIdentifier.toUpperCase());
            if (!reactRole) {
                return;
            }
            const guildRole = reaction.guild.roles.find(r => r.id === reactRole);
            if (!guildRole) {
                config.selfAssign.handleRemovedRole(reactRole);
                return;
            }
            reaction.member.removeRole(guildRole);
        });
    }
    handleOnChannelDelete() {
        this.client.on('channelDelete', (channel) => {
            if (!channel.guild.id) {
                return;
            }
            const config = this.configs[channel.guild.id];
            if (config.isActiveChannel(channel.id)) {
                config.removeActiveChannel(channel.id);
            }
            config.selfAssign.handleRemovedChannel(channel.id);
        });
    }
    handleOnRoleDelete() {
        this.client.on('roleDelete', role => {
            const config = this.configs[role.guild.id];
            config.selfAssign.handleRemovedRole(role.id);
        });
    }
    handleOnRawMessageDelete() {
        this.client.on('raw', raw => {
            if (raw.t === 'MESSAGE_DELETE') {
                if (!raw.d.guild_id) {
                    return;
                }
                const config = this.configs[raw.d.guild_id];
                config.selfAssign.handleRemovedMessage(raw.d.id);
            }
        });
    }
    handleOnGuildMemberAdd() {
        this.client.on('guildMemberAdd', guildMember => {
            const config = this.configs[guildMember.guild.id];
            config.selfAssign.getAllReactions().forEach(async (messageReactionsConfig) => {
                const channel = guildMember.guild.channels.find(c => c.id === messageReactionsConfig.channelId);
                if (!channel) {
                    config.selfAssign.handleRemovedChannel(messageReactionsConfig.channelId);
                    return;
                }
                const message = await channel.fetchMessage(messageReactionsConfig.messageId);
                if (!message) {
                    config.selfAssign.handleRemovedMessage(messageReactionsConfig.messageId);
                    return;
                }
                message.reactions.tap(async (reaction) => {
                    const role = messageReactionsConfig.reactions.find(e => e.emoteIdentifier === (reaction.emoji.id ? reaction.emoji.identifier.toUpperCase() : reaction.emoji.name));
                    if (role) {
                        const guildRole = guildMember.guild.roles.find(r => r.id === role.roleId);
                        if (!guildRole) {
                            config.selfAssign.handleRemovedRole(role.roleId);
                            return;
                        }
                        if ((await reaction.fetchUsers(reaction.count)).find(u => u.id === guildMember.id)) {
                            guildMember.addRole(guildRole);
                        }
                    }
                });
            });
        });
    }
    handleOnCommand() {
        this.client.on('command', (message) => {
            const config = this.configs[message.guild.id];
            if (config.logChannel) {
                const logChannel = message.guild.channels.find(c => c.id === config.logChannel);
                if (!logChannel) {
                    config.setLogChannel(null);
                    return;
                }
                const embed = new discord_js_1.RichEmbed()
                    .setColor(this.color)
                    .setAuthor(message.author.tag, message.author.avatarURL, message.url)
                    .addField(`#${message.channel.name}`, message.cleanContent, true)
                    .addBlankField(true)
                    .setThumbnail('https://www.landviz.nl/host/logogrey-small.png')
                    .setTimestamp(new Date(message.createdTimestamp));
                logChannel.send(embed);
            }
        });
    }
}
exports.RoleBot = RoleBot;
