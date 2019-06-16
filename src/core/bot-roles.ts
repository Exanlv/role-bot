import { Client, Message, Guild, GuildChannel, TextChannel, RichEmbed } from 'discord.js';
import { ServerConfig } from '@classes/server-config';
import { ShortReact } from '@classes/short-react';
import { CommandConfig } from '@classes/command-config';
import { getCommandConfig } from '@bot-roles/command-configs';
import { EventEmitter } from 'events';
import { GlobalConfig } from '@classes/global-config';

export class RoleBot extends EventEmitter {
	private token: string;
	public client: Client;

	public configs: {[id: string]: ServerConfig} = {};

	public globalConfig: GlobalConfig;

	private rootDir: string;
	private dataDir: string;

	constructor(token: string, rootDir: string, globalConfig: GlobalConfig) {
		super();
		
		this.client = new Client();
		this.token = token;

		this.globalConfig = globalConfig;

		this.rootDir = rootDir;
		this.dataDir = `${this.rootDir}/data`;

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

	private async login() {
		await this.client.login(this.token);
	}

	private addConfig(guildId: string) {
		if (!this.configs[guildId])
			this.configs[guildId] = new ServerConfig(guildId, `${this.dataDir}/configs`);
	}

	private removeConfig(guildId: string, del: boolean = false) {
		if (del) {
			this.configs[guildId].delete();
		}

		if (this.configs[guildId])
			delete this.configs[guildId];
	}

	private loadConfigs() {
		this.client.guilds.forEach(g => {
			this.addConfig(g.id)
		});

		this.globalConfig.devServer = this.client.guilds.find(g => g.id === this.globalConfig.devServerId);

		if (!this.globalConfig.devServer) {
			throw('Dev server not found');
		}
	}

	private handleOnReady() {
		this.client.on('ready', () => {
			console.log(`Logged in as ${this.client.user.tag}`);
		});
	}

	private handleOnError() {
		this.client.on('error', error => {
			console.log(error);
		});
	}

	private handleOnMessage() {
		this.client.on('message', async (message: Message) => {
			if (message.author.id === this.client.user.id || !message.guild) {
				return;
			}

			const config = this.configs[message.guild.id];

			if (config.activeChannels.length && !config.activeChannels.includes(message.channel.id)) {
				return;
			}

			const rawMessage = message.cleanContent.toUpperCase();
			let mode: 'dev'|'admin'|'public';

			if (rawMessage.startsWith(this.globalConfig.prefixes.dev)) {
				if (!this.globalConfig.developers.includes(message.member.id)) {
					return;
				}

				mode = 'dev';
			} else if (rawMessage.startsWith(this.globalConfig.prefixes.admin)) {
				let confirmedAdmin = false;

				if (this.globalConfig.developers.includes(message.member.id) || message.member.hasPermission('ADMINISTRATOR')) {
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
			} else if (rawMessage.startsWith(config.prefix)) {
				mode = 'public';
			} else {
				return;
			}

			const prefix = {dev: this.globalConfig.prefixes.dev, admin: this.globalConfig.prefixes.admin, public: config.prefix}[mode];
			const command = rawMessage.replace(prefix, '');
			const args = command.split(' ');

			this.client.emit('command', message);

			const commandConfig: CommandConfig = getCommandConfig(mode, args);

			if (!commandConfig) {
				message.channel.send(`Invalid command! Use \`\`${prefix}help\`\` for a list of commands`);
				return;
			}

			new commandConfig.commandClass(message, config, command, args, this.client, this.globalConfig).runCommand();
		});
	}

	private handleOnGuildCreate() {
		this.client.on('guildCreate', (guild: Guild) => {
			this.addConfig(guild.id);
		});
	}

	private handleOnGuildDelete() {
		this.client.on('guildDelete', (guild: Guild) => {
			this.removeConfig(guild.id, true);
		});
	}

	private handleOnRawMessageReacts() {
		const events = {
			MESSAGE_REACTION_ADD: 'CustomReactAdd',
			MESSAGE_REACTION_REMOVE: 'CustomReactRemove'
		};
		
		this.client.on('raw', async event => {
			if (!events.hasOwnProperty(event.t)) return;
		
			const shortReact = new ShortReact;
		
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

	private handleOnCustomReactAdd() {
		this.client.on('CustomReactAdd', (reaction: ShortReact) => {
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
				config.selfAssign.handleRemovedRole(reactRole)
				return;
			}

			reaction.member.addRole(guildRole).catch(e => {
				// this.handleError
			});
		});
	}

	private handleOnCustomReactRemove() {
		this.client.on('CustomReactRemove', (reaction: ShortReact) => {
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

	private handleOnChannelDelete() {
		this.client.on('channelDelete', (channel: GuildChannel) => {
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

	private handleOnRoleDelete() {
		this.client.on('roleDelete', role => {
			const config = this.configs[role.guild.id];

			config.selfAssign.handleRemovedRole(role.id);
		});
	}

	private handleOnRawMessageDelete() {
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

	private handleOnGuildMemberAdd() {
		this.client.on('guildMemberAdd', guildMember => {
			const config = this.configs[guildMember.guild.id];

			config.selfAssign.getAllReactions().forEach(async messageReactionsConfig => {
				const channel = guildMember.guild.channels.find(c => c.id === messageReactionsConfig.channelId) as TextChannel;

				if (!channel) {
					config.selfAssign.handleRemovedChannel(messageReactionsConfig.channelId);
					return;
				}

				const message = await channel.fetchMessage(messageReactionsConfig.messageId);

				if (!message) {
					config.selfAssign.handleRemovedMessage(messageReactionsConfig.messageId);
					return;
				}

				message.reactions.tap(async reaction => {
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
		})
	}

	private handleOnCommand() {
		this.client.on('command', (message: Message) => {
			const config = this.configs[message.guild.id];

			if (config.logChannel) {
				const logChannel = message.guild.channels.find(c => c.id === config.logChannel) as TextChannel;

				if (!logChannel) {
					config.setLogChannel(null);
					return;
				}

				const embed = new RichEmbed()
					.setColor(this.globalConfig.accentColor)
					.setAuthor(message.author.tag, message.author.avatarURL, message.url)
					.addField(`#${(message.channel as TextChannel).name}`, message.cleanContent, true)
					.addBlankField(true)
					.setThumbnail('https://www.landviz.nl/host/logogrey-small.png')
					.setTimestamp(new Date(message.createdTimestamp))
				;
				logChannel.send(embed);
			}
		})
	}
}