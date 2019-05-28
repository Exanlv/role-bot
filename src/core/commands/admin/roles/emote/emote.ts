import { AdminCommand } from "../../_admin";
import { GlobalConfig } from "../../../../../global-config";
import { Emoji } from "discord.js";

export class EmoteCommand extends AdminCommand {
	private async isDiscordEmoji(input): Promise<boolean|string> {
		let emoji;
		try {
			emoji = await this.message.react(input)
		}
		catch (err) {
			return false;
		}

		emoji.remove();
		return input;
	}

	public async emoteValidate(input: string, customName = null): Promise<string | Emoji | false> {
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
			return await this.getEmote(emoteSplit.join(':'), customName)
		}
	}

	public async getEmote(input: string, customName: string = null) {
		if (!customName) {
			let emote = this.client.emojis.find(e => e.identifier.toUpperCase() === input);
			if (emote) {
				return emote;
			}
		}

		const inputSplit = input.split(':');
		console.log(input);

		const botGuild = this.client.guilds.find(g => g.id === GlobalConfig.devServer);
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