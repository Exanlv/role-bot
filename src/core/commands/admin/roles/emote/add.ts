import { BaseCommandInterface } from "../../../../base-command";
import { TextChannel, Message, Emoji } from "discord.js";
import { firstLetterUppercase } from "../../../../functions";
import { GlobalConfig } from "../../../../../global-config";

import * as fetch from 'node-fetch';
import { AdminCommand } from "../../_admin";

export class AddEmoteCommand extends AdminCommand implements BaseCommandInterface {
    public async runCommand() {
		this.loadInput();
		
		const roleName = this.input.ROLE || this.input.R || await this.getUserInput('`> enter role name`');

		if (!roleName) {
			this.sendMessage('Could not add reaction role assignment; no role was given');
			return;
		}

		const role = await this.message.guild.roles.find(r => r.name.toUpperCase() === roleName);

		if (!role) {
			this.sendMessage(`Could not add reaction role assignment; role \`\`${firstLetterUppercase(roleName)}\`\` does not exist`);
			return;
		}

		const categoryName = this.input.CATEGORY || this.input.C || await this.getUserInput('`> enter category name`');

		if (!categoryName) {
			this.sendMessage('Could not add reaction role assignment; no category was given');
			return;
		}

		if (!this.serverConfig.selfAssign.categoryExists(categoryName)) {
			this.sendMessage(`Could not add reaction role assignment; category \`\`${categoryName}\`\` does not exist`);
			return;
		}

		if (!this.serverConfig.selfAssign.roleIsInCategory(categoryName, role.id)) {
			this.sendMessage(`Could not add reaction role assignment; role \`\`${role.name}\`\` is not in category \`\`${firstLetterUppercase(categoryName)}\`\``);
			return;
		}

		let messageLink = this.args.find(a => a.startsWith('HTTPS://DISCORDAPP.COM/CHANNELS/'));
		if(!messageLink) messageLink = await this.getUserInput('`> enter message link`') || '';
		const messageData = messageLink.replace('HTTPS://DISCORDAPP.COM/CHANNELS/', '').split('/');

		if (!messageData) {
			this.sendMessage('Could not add reaction role assignment; no message link was given');
			return;
		}

		if (messageData.length !== 3) {
			this.sendMessage('Could not add reaction role assignment; invalid message url');
			return;
		}

		const guildId = messageData[0];

		if (guildId !== this.message.guild.id) {
			this.sendMessage('Could not add reaction role assignment; message is not on this guild');
			return;
		}

		const channelId = messageData[1];

		const channel = this.message.guild.channels.find(c => c.id === channelId) as TextChannel;

		if (!channel) {
			this.sendMessage('Could not add reaction role assignment; invalid channel, possibly lacking permissions');
			return;
		}

		const messageId = messageData[2];

		const reactMessage = await channel.fetchMessage(messageId);

		if (!reactMessage) {
			this.sendMessage('Could not add reaction role assignment; invalid message');
			return;
		}

		if (reactMessage.reactions.size > 19) {
			this.sendMessage('Could not add reaction role assignment; too many reacts on this message');
			return;
		}

		this.message.channel.send('Please add the react for the role to this message').then(message => {
			message = message as Message;
			message.awaitReactions((reaction, user) => user.id === this.message.author.id, {max: 1, time: 60000}).then(async collection => {
				const reactedEmote = collection.first().emoji;
				let emoteToReact = reactedEmote;

				if (reactedEmote.id && !this.client.emojis.find(e => e.id === reactedEmote.id)) {
					emoteToReact = await this.uploadEmote(emoteToReact as Emoji) || null;
				}

				if (!emoteToReact) {
					this.sendMessage('Something went wrong trying to use this emote, try again later');
					return;
				}

				reactMessage.react(emoteToReact).then(e => {
					this.serverConfig.selfAssign.addEmote(categoryName, role.id, messageId, channelId, e.emoji.id ? e.emoji.identifier.toUpperCase() : e.emoji.name);
					this.serverConfig.saveConfig();
					this.sendMessage('Reaction role added');
					this.deleteEmote(emoteToReact as Emoji);
				}).catch(e => {
					this.handleError(e, 'AddReact');
					this.deleteEmote(emoteToReact as Emoji);
				});
			});
		});
	}

	public async uploadEmote(emoji: Emoji): Promise<Emoji|void> {
		const botGuild = this.client.guilds.find(g => g.id === GlobalConfig.devServer);

		let gifExists = (await fetch(`https://cdn.discordapp.com/emojis/${emoji.id}.gif`, {method: 'HEAD'})).status === 200;
		const url = `https://cdn.discordapp.com/emojis/${emoji.id}.${gifExists ? 'gif' : 'png'}`; 
		const emote = await botGuild.createEmoji(url, emoji.name).catch(e => {
			this.handleError(e, 'UploadEmote');
		});

		return emote;
	}

	public async deleteEmote(emoji: Emoji): Promise<void> {
		const botGuild = this.client.guilds.find(g => g.id === GlobalConfig.devServer);
		await botGuild.deleteEmoji(emoji);
	}
}