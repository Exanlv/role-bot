import { getCommandConfig } from '@bot-roles/command-configs';
import { CommandConfig } from '@classes/command-config';
import { GlobalConfig } from '@classes/global-config';
import { MessageReactionsConfig } from '@classes/message-reactions-config';
import { ReactionConf } from '@classes/reaction-conf';
import { ServerConfig } from '@classes/server-config';
import { ShortReact } from '@classes/short-react';
import { Client, DiscordAPIError, Guild, GuildChannel, GuildMember, Message, MessageReaction, RichEmbed, Role, TextChannel, User } from 'discord.js';
import { EventEmitter } from 'events';

export class RoleBot extends EventEmitter {
	public client: Client;

	public configs: {[id: string]: ServerConfig} = {};

	public globalConfig: GlobalConfig;
	private token: string;

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

	private async login(): Promise<void> {
		await this.client.login(this.token);
	}

	private addConfig(guildId: string): void {
		if (!this.configs[guildId]) {
			this.configs[guildId] = new ServerConfig(guildId, `${this.dataDir}/configs`);
		}
	}

	private removeConfig(guildId: string, del: boolean = false): void {
		if (del) {
			this.configs[guildId].delete();
		}

		if (this.configs[guildId]) {
			delete this.configs[guildId];
		}
	}

	private loadConfigs(): void {
		this.client.guilds.forEach((g: Guild) => {
			this.addConfig(g.id);
		});

		this.globalConfig.devServer = this.client.guilds.find((g: Guild) => g.id === this.globalConfig.devServerId);

		if (!this.globalConfig.devServer) {
			throw new Error(('Dev server not found'));
		}
	}

	private handleOnReady(): void {
		this.client.on('ready', () => {
			console.log(`Logged in as ${this.client.user.tag}`);
		});
	}

	private handleOnError(): void {
		this.client.on('error', (error: Error) => {
			console.log(error);
		});
	}

	private handleOnMessage(): void {
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
					if (message.member.roles.find((r: Role) => r.id === config.adminRoles[i])) {
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

	private handleOnGuildCreate(): void {
		this.client.on('guildCreate', (guild: Guild) => {
			this.addConfig(guild.id);
		});
	}

	private handleOnGuildDelete(): void {
		this.client.on('guildDelete', (guild: Guild) => {
			this.removeConfig(guild.id, true);
		});
	}

	private handleOnRawMessageReacts(): void {
		const events = {
			MESSAGE_REACTION_ADD: 'CustomReactAdd',
			MESSAGE_REACTION_REMOVE: 'CustomReactRemove',
		};

		this.client.on('raw', async (event: any) => {
			if (!events.hasOwnProperty(event.t)) { return; }

			const shortReact = new ShortReact();

			if (!event.d.guild_id) {
				return;
			}

			shortReact.guild = this.client.guilds.find((g: Guild) => g.id === event.d.guild_id);
			shortReact.member = shortReact.guild.members.find((m: GuildMember) => m.id === event.d.user_id);
			shortReact.messageId = event.d.message_id;
			shortReact.emoteIdentifier = event.d.emoji.id ? `${event.d.emoji.name.split('~')[0]}:${event.d.emoji.id}` : event.d.emoji.name;

			this.client.emit(events[event.t], shortReact);
		});
	}

	private handleOnCustomReactAdd(): void {
		this.client.on('CustomReactAdd', (reaction: ShortReact) => {
			if (reaction.member.id === this.client.user.id) {
				return;
			}

			const config = this.configs[reaction.guild.id];

			const reactRole = config.selfAssign.getReactRole(reaction.messageId, reaction.emoteIdentifier.toUpperCase());

			if (!reactRole) {
				return;
			}

			const guildRole = reaction.guild.roles.find((r: Role) => r.id === reactRole);

			if (!guildRole) {
				config.selfAssign.handleRemovedRole(reactRole);
				return;
			}

			reaction.member.addRole(guildRole).catch((e: DiscordAPIError) => {
				// this.handleError
			});
		});
	}

	private handleOnCustomReactRemove(): void {
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

			const guildRole = reaction.guild.roles.find((r: Role) => r.id === reactRole);

			if (!guildRole) {
				config.selfAssign.handleRemovedRole(reactRole);
				return;
			}

			reaction.member.removeRole(guildRole);
		});
	}

	private handleOnChannelDelete(): void {
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

	private handleOnRoleDelete(): void {
		this.client.on('roleDelete', (role: Role) => {
			const config = this.configs[role.guild.id];

			config.selfAssign.handleRemovedRole(role.id);
		});
	}

	private handleOnRawMessageDelete(): void {
		this.client.on('raw', (raw: any) => {
			if (raw.t === 'MESSAGE_DELETE') {
				if (!raw.d.guild_id) {
					return;
				}

				const config = this.configs[raw.d.guild_id];
				config.selfAssign.handleRemovedMessage(raw.d.id);
			}
		});
	}

	private handleOnGuildMemberAdd(): void {
		this.client.on('guildMemberAdd', (guildMember: GuildMember) => {
			const config = this.configs[guildMember.guild.id];

			config.selfAssign.getAllReactions().forEach(async (messageReactionsConfig: MessageReactionsConfig) => {
				const channel = guildMember.guild.channels.find((c: GuildChannel) => c.id === messageReactionsConfig.channelId) as TextChannel;

				if (!channel) {
					config.selfAssign.handleRemovedChannel(messageReactionsConfig.channelId);
					return;
				}

				const message = await channel.fetchMessage(messageReactionsConfig.messageId);

				if (!message) {
					config.selfAssign.handleRemovedMessage(messageReactionsConfig.messageId);
					return;
				}

				message.reactions.tap(async (reaction: MessageReaction) => {
					const role = messageReactionsConfig.reactions.find((e: ReactionConf) => e.emoteIdentifier === (reaction.emoji.id ? reaction.emoji.identifier.toUpperCase() : reaction.emoji.name));
					if (role) {
						const guildRole = guildMember.guild.roles.find((r: Role) => r.id === role.roleId);

						if (!guildRole) {
							config.selfAssign.handleRemovedRole(role.roleId);
							return;
						}

						if ((await reaction.fetchUsers(reaction.count)).find((u: User) => u.id === guildMember.id)) {
							guildMember.addRole(guildRole);
						}
					}
				});
			});
		});
	}

	private handleOnCommand(): void {
		this.client.on('command', (message: Message) => {
			const config = this.configs[message.guild.id];

			if (config.logChannel) {
				const logChannel = message.guild.channels.find((c: TextChannel) => c.id === config.logChannel) as TextChannel;

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
		});
	}
}
