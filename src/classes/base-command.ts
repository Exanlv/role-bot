import { GlobalConfig } from '@classes/global-config';
import { List } from '@classes/list';
import { ServerConfig } from '@classes/server-config';
import { Client, DiscordAPIError, GuildChannel, Message, RichEmbed, TextChannel } from 'discord.js';
import { ListValue } from '@classes/list-value';

export class BaseCommand {
	public serverConfig: ServerConfig;
	public message: Message;
	public command: string;
	public args: string[];
	public input: {[key: string]: string} = {};
	public client: Client;
	public globalConfig: GlobalConfig;

	constructor(message: Message, serverConfig: ServerConfig, command: string, args: string[], client: Client, globalConfig: GlobalConfig) {
		this.serverConfig = serverConfig;
		this.message = message;
		this.command = command;
		this.args = args;
		this.client = client;
		this.globalConfig = globalConfig;
	}

	public sendList(list: List, includeEmpty: boolean = true): void {
		const embed = new RichEmbed()
			.setColor(list.color || this.globalConfig.accentColor)
		;

		if (list.title) {
			embed.setTitle(list.title);
			embed.addBlankField();
		}

		list.values.forEach((listValue: ListValue, i: number) => {
			let longestValue = listValue.title.length;

			for (let i = 0; i < listValue.values.length; i++) {
				if (listValue.values[i].length > longestValue) {
					longestValue = listValue.values[i].length;
				}
			}

			const value = listValue.values.join('\n');
			embed.addField(listValue.title, value + '\n\n', includeEmpty && longestValue < 40);
			if (((i + 1 !== list.values.length) || list.values.length === 1) && includeEmpty && longestValue < 40) {
				embed.addBlankField(true);
			}
		});

		if (list.thumbnail) {
			embed.setThumbnail(list.thumbnail);
		}

		this.message.channel.send(embed)
			.catch((e: DiscordAPIError) => {this.handleError(e, 'SendList'); })
		;
	}

	public handleError(error: any, id: string): void {
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
				const channel = this.message.channel as TextChannel;

				let message = `Hey! There is an issue with bot permissions on your guild \`\`${this.message.guild.name}\`\`\n\n\`\`\`${errorMessage}\`\`\``;
				message += `\`\`\`Channel: ${channel.name}, ${channel.id}\nCommand: ${this.command}\nUser: ${this.message.author.tag}, ${this.message.author.id}\`\`\`\n\n`;

				const sendActiveChannelReminder = ['SendList', 'SendMessage'];
				if (sendActiveChannelReminder.includes(id)) {
					message += `If you don't want the bot to be active in this channel, please use \`\`${this.globalConfig.prefixes.admin}active-channels\`\` to set up active channels.`;
				}

				this.message.guild.owner.send(message)
					.catch((e: DiscordAPIError) => {
						return;
					})
				;
				return;
			}
		}

		const errorChannel = this.globalConfig.devServer.channels.find((c: GuildChannel) => c.name === 'errors') as TextChannel;

		if (!errorChannel) {
			return;
		}

		errorChannel.send(`\`\`${id}\`\` caused error \`\`${error.message}\`\``);
	}

	public sendMessage(message: string): void {
		this.message.channel.send(message)
			.catch((e: DiscordAPIError) => {
				this.handleError(e, 'SendMessage');
			})
		;
	}

	public async getUserInput(message: string): Promise<string|false> {
		this.sendMessage(message);
		const reply = await this.message.channel.awaitMessages((m: Message) => m.author.id === this.message.author.id, {maxMatches: 1, time: 20000});

		if (reply.first() && reply.first().content.toUpperCase() !== '~~EXIT') {
			return reply.first().content.toUpperCase();
		}

		return false;
	}

	protected loadInput(trim: boolean = true): void {
		let input = ` ${this.args.join(' ')}`;
		const regex = / ([A-Z|0-9]*?):{(.*?)}/;
		const matches = [];
		let cont = true;
		while (cont) {
			const newValue = regex.exec(input);

			if (newValue) {
				matches.push(newValue);
				input = input.substring(input.indexOf(newValue[0]) + newValue[0].length);
			} else {
				cont = false;
			}
		}

		matches.forEach((match: any) => {
			this.input[match[1]] = trim ? match[2].trim() : match[2];
		});
	}
}

export interface IBaseCommand {
	runCommand(): Promise<void>|void;
}
