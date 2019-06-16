import { BaseCommand, IBaseCommand } from '@classes/base-command';
import { MessageReactionsConfig } from '@classes/message-reactions-config';
import { ReactionConf } from '@classes/reaction-conf';
import { firstLetterUppercase } from '@core/functions';
import { GuildChannel, MessageReaction, Role, TextChannel } from 'discord.js';

export class RemoveEmoteCommand extends BaseCommand implements IBaseCommand {
	public static description: string = 'Removes a react role';

	public async runCommand(): Promise<void> {
		this.loadInput();

		const category = this.input.CATEGORY || this.input.C || await this.getUserInput('``> enter category name``');

		if (!category) {
			this.sendMessage('Could not remove reaction role assignment; no category was given');
			return;
		}

		if (!this.serverConfig.selfAssign.categoryExists(category)) {
			this.sendMessage(`Could not remove reaction role assignment; category \`\`${firstLetterUppercase(category)}\`\` does not exist`);
			return;
		}

		const role = this.input.ROLE || this.input.R || await this.getUserInput('``> enter role name``');

		if (!role) {
			this.sendMessage('Could not remove reaction role assignment; no role was given');
			return;
		}

		const guildRole = this.message.guild.roles.find((r: Role) => r.name.toUpperCase() === role);

		if (!guildRole) {
			this.sendMessage(`Could not remove reaction role assignment; role \`\`${firstLetterUppercase(role)}\`\` does not exist`);
			return;
		}

		if (!this.serverConfig.selfAssign.roleIsInCategory(category, guildRole.id)) {
			this.sendMessage(`Could not remove reaction role assignment; role \`\`${guildRole.name}\`\` is not in category \`\`${firstLetterUppercase(category)}\`\``);
			return;
		}

		const userInputToRemove = ((this.input.REMOVE || this.input.RM || await this.getUserInput('``> enter indexes to remove``') as string) || '').split(' ') as Array<number|string>;
		const toRemove: number[] = [];
		// console.log(toRemove);
		for (let i = 0; i < userInputToRemove.length; i++) {
			if (userInputToRemove[i] !== '' && !isNaN(Number(userInputToRemove[i]))) {
				toRemove.push(Number(userInputToRemove[i]));
			}
		}

		if (!toRemove.length) {
			this.sendMessage('Could not remove reaction role assignment; no numbers of reacts to remove were given');
			return;
		}

		const messageReactionsToRemove = this.serverConfig.selfAssign.removeEmotes(category, guildRole.id, toRemove);

		await messageReactionsToRemove.forEach(async (conf: MessageReactionsConfig) => {
			const channel = this.message.guild.channels.find((c: GuildChannel) => c.id === conf.channelId) as TextChannel;
			const message = await channel.fetchMessage(conf.messageId);

			await conf.reactions.forEach(async (reaction: ReactionConf) => {
				const messageReaction = message.reactions.find((e: MessageReaction) => (e.emoji.id ? e.emoji.identifier.toUpperCase() : e.emoji.name) === reaction.emoteIdentifier);

				if (messageReaction) {
					await messageReaction.remove();
				}
			});
		});

		this.sendMessage(`Succesfully removed react(s) \`\`${toRemove.join(', ')}\`\` from \`\`${guildRole.name}\`\` in category \`\`${firstLetterUppercase(category)}\`\``);
	}
}
