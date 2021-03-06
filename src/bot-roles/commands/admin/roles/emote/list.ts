import { BaseCommand, IBaseCommand } from '@classes/base-command';
import { List } from '@classes/list';
import { ListValue } from '@classes/list-value';
import { RoleConfig } from '@classes/role-config';
import { firstLetterUppercase } from '@core/functions';
import { GuildChannel, Role, TextChannel } from 'discord.js';

export class ListEmoteCommand extends BaseCommand implements IBaseCommand {
	public static description: string = 'Lists the current reacts';

	public async runCommand(): Promise<void> {
		let categorys: string[];
		if (this.args.length) {
			this.loadInput();

			const category = this.input.CATEGORY || this.input.C || this.args.join(' ');
			const role = this.input.ROLE || this.input.R;

			if (category) {
				if (this.serverConfig.selfAssign.categoryExists(category)) {
					if (role) {
						const guildRole = this.message.guild.roles.find((r: Role) => r.name.toUpperCase() === role);

						if (!guildRole) {
							this.sendMessage(`Unable to list reacts for role \`\`${firstLetterUppercase(role)}\`\`; this role does not exist`);
							return;
						}

						const list = new List();
						list.title = `Reaction role setup for ${guildRole.name} in ${firstLetterUppercase(category)}`;

						const categoryConfig = this.serverConfig.selfAssign.getCategory(category);
						for (let i = 0; i < categoryConfig.roles.length; i++) {
							if (categoryConfig.roles[i].id === guildRole.id) {
								for (let j = 0; j < categoryConfig.roles[i].emoteReacts.length; j++) {
									const channel = this.message.guild.channels.find((c: GuildChannel) => c.id === categoryConfig.roles[i].emoteReacts[j].channelId) as TextChannel;
									if (!channel) {
										this.serverConfig.selfAssign.handleRemovedChannel(categoryConfig.roles[i].emoteReacts[j].channelId);
										continue;
									}

									if (!(await channel.fetchMessage(categoryConfig.roles[i].emoteReacts[j].messageId))) {
										this.serverConfig.selfAssign.handleRemovedMessage(categoryConfig.roles[i].emoteReacts[j].messageId);
										continue;
									}

									const listValue = new ListValue();
									listValue.title = `#${j + 1}:`;
									listValue.values.push(`Channel: ${categoryConfig.roles[i].emoteReacts[j].channelId}`);
									listValue.values.push(`Message: ${categoryConfig.roles[i].emoteReacts[j].messageId}`);
									listValue.values.push(`Emote: ${firstLetterUppercase(categoryConfig.roles[i].emoteReacts[j].emote.split(':')[0])}`);
									listValue.values.push(`Link: https://discordapp.com/channels/${this.message.guild.id}/${categoryConfig.roles[i].emoteReacts[j].channelId}/${categoryConfig.roles[i].emoteReacts[j].messageId}`);

									list.values.push(listValue);
								}
							}
						}

						if (list.values.length < 1) {
							this.sendMessage('This role does not have any reacts set up');
							return;
						}

						this.sendList(list, false);
						return;
					}

					categorys = [category];
				} else {
					this.sendMessage(role ? 'Please specify the category the role is in' : `Category \`\`${firstLetterUppercase(category)}\`\` does not exist`);
					return;
				}
			}
		} else {
			categorys = this.serverConfig.selfAssign.getCategories();
		}

		if (categorys.length === 0) {
			this.sendMessage('No roles/categorys are currently set up');
			return;
		}

		const list = new List();

		categorys.forEach((categoryName: string) => {
			const listValue = new ListValue();
			listValue.title = firstLetterUppercase(categoryName);
			this.serverConfig.selfAssign.getCategory(categoryName).roles.forEach((roleConfig: RoleConfig) => {
				const role = this.message.guild.roles.find((r: Role) => r.id === roleConfig.id);

				if (!role) {
					this.serverConfig.selfAssign.handleRemovedRole(roleConfig.id);
					return;
				}

				listValue.values.push(`- ${role.name}, ${roleConfig.emoteReacts.length} react(s)`);
			});

			if (!listValue.values.length) {
				listValue.values.push('- No self-assignable roles');
			}

			list.values.push(listValue);
		});

		this.sendList(list);
	}
}
