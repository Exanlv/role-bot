import { AdminCommand } from "../../_admin";
import { BaseCommandInterface } from "../../../../base-command";
import { firstLetterUppercase } from "../../../../functions";
import { TextChannel } from "discord.js";

export class RemoveEmoteCommand extends AdminCommand implements BaseCommandInterface {
    public runCommand() {
		this.loadInput();
		
		const category = this.input.CATEGORY || this.input.C;
		const role = this.input.ROLE || this.input.R;
		const toRemove = (this.input.REMOVE || this.input.RM).split(' ') as Array<number>;

		if (!category) {
			this.sendMessage('Could not remove reaction role assignment; no category was given');
			return;
		}

		if (!role) {
			this.sendMessage('Could not remove reaction role assignment; no role was given');
			return;
		}

		if (!toRemove.length) {
			this.sendMessage('Could not remove reaction role assignment; no numbers of reacts to remove were given');
			return;
		}

		if (!this.serverConfig.selfAssign.categoryExists(category)) {
			this.sendMessage(`Could not remove reaction role assignment; category \`\`${firstLetterUppercase(category)}\`\` does not exist`);
			return;
		}

		const guildRole = this.message.guild.roles.find(r => r.name.toUpperCase() === role);

		if (!guildRole) {
			this.sendMessage(`Could not remove reaction role assignment; role \`\`${role}\`\` does not exist`);
			return;
		}

		if (!this.serverConfig.selfAssign.roleIsInCategory(category, guildRole.id)) {
			this.sendMessage(`Could not remove reaction role assignment; role \`\`${guildRole.name}\`\` is not in category \`\`${firstLetterUppercase(category)}\`\``);
			return;
		}

		const messageReactionsToRemove = this.serverConfig.selfAssign.removeEmotes(category, guildRole.id, toRemove);

		this.serverConfig.saveConfig();

		messageReactionsToRemove.forEach(async conf => {
			const channel = this.message.guild.channels.find(c => c.id === conf.channelId) as TextChannel;
			const message = await channel.fetchMessage(conf.messageId);

			conf.reactions.forEach(reaction => {
				const messageReaction = message.reactions.find(e => (e.emoji.id ? e.emoji.identifier.toUpperCase() : e.emoji.name) === reaction.emoteIdentifier);

				if (messageReaction) {
					messageReaction.remove();
				}
			});
		});


		this.sendMessage(`Succesfully removed reacts \`\`${toRemove.join(', ')}\`\` from \`\`${guildRole.name}\`\` in category \`\`${firstLetterUppercase(category)}\`\``);
    }
}