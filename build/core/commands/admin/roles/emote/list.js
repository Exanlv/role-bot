"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _admin_1 = require("../../_admin");
const list_1 = require("../../../../../shared/classes/list");
const list_value_1 = require("../../../../../shared/classes/list-value");
const functions_1 = require("../../../../functions");
class ListEmoteCommand extends _admin_1.AdminCommand {
    async runCommand() {
        let categorys;
        if (this.args.length) {
            this.loadInput();
            const category = this.input.CATEGORY || this.input.C || this.args.join(' ');
            const role = this.input.ROLE || this.input.R;
            if (category) {
                if (this.serverConfig.selfAssign.categoryExists(category)) {
                    if (role) {
                        const guildRole = this.message.guild.roles.find(r => r.name.toUpperCase() === role);
                        if (!guildRole) {
                            this.sendMessage(`Unable to list reacts for role \`\`${functions_1.firstLetterUppercase(role)}\`\`; this role does not exist`);
                            return;
                        }
                        const list = new list_1.List;
                        list.title = `Reaction role setup for ${guildRole.name} in ${functions_1.firstLetterUppercase(category)}`;
                        const categoryConfig = this.serverConfig.selfAssign.getCategory(category);
                        for (let i = 0; i < categoryConfig.roles.length; i++) {
                            if (categoryConfig.roles[i].id === guildRole.id) {
                                for (let j = 0; j < categoryConfig.roles[i].emoteReacts.length; j++) {
                                    let channel = this.message.guild.channels.find(c => c.id === categoryConfig.roles[i].emoteReacts[j].channelId);
                                    if (!channel) {
                                        this.serverConfig.selfAssign.handleRemovedChannel(categoryConfig.roles[i].emoteReacts[j].channelId);
                                        continue;
                                    }
                                    if (!(await channel.fetchMessage(categoryConfig.roles[i].emoteReacts[j].messageId))) {
                                        this.serverConfig.selfAssign.handleRemovedMessage(categoryConfig.roles[i].emoteReacts[j].messageId);
                                        continue;
                                    }
                                    const listValue = new list_value_1.ListValue;
                                    listValue.title = `#${j + 1}:`;
                                    listValue.values.push(`Channel: ${categoryConfig.roles[i].emoteReacts[j].channelId}`);
                                    listValue.values.push(`Message: ${categoryConfig.roles[i].emoteReacts[j].messageId}`);
                                    listValue.values.push(`Emote: ${functions_1.firstLetterUppercase(categoryConfig.roles[i].emoteReacts[j].emote.split(':')[0])}`);
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
                }
                else {
                    this.sendMessage(role ? 'Please specify the category the role is in' : `Category \`\`${functions_1.firstLetterUppercase(category)}\`\` does not exist`);
                    return;
                }
            }
        }
        else {
            categorys = this.serverConfig.selfAssign.getCategories();
        }
        if (categorys.length === 0) {
            this.sendMessage('No roles/categorys are currently set up');
            return;
        }
        const list = new list_1.List;
        categorys.forEach(categoryName => {
            const listValue = new list_value_1.ListValue;
            listValue.title = functions_1.firstLetterUppercase(categoryName);
            this.serverConfig.selfAssign.getCategory(categoryName).roles.forEach(roleConfig => {
                const role = this.message.guild.roles.find(r => r.id === roleConfig.id);
                if (!role) {
                    this.serverConfig.selfAssign.handleRemovedRole(roleConfig.id);
                    return;
                }
                listValue.values.push(`- ${role.name}, ${roleConfig.emoteReacts.length} react(s)`);
            });
            if (!listValue.values.length)
                listValue.values.push('- No self-assignable roles');
            list.values.push(listValue);
        });
        this.sendList(list);
    }
}
exports.ListEmoteCommand = ListEmoteCommand;
