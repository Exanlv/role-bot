"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const role_category_1 = require("./role-category");
const role_config_1 = require("./role-config");
const role_react_1 = require("./role-react");
const message_reactions_config_1 = require("./message-reactions-config");
class SelfAssign {
    constructor(data) {
        this.roles = [];
        if (data) {
            this.roles = data;
            return;
        }
    }
    /**
     * Returns the roles as a raw array
     */
    raw() {
        return this.roles;
    }
    /**
     * Returns a category
     * @param categoryName The name of the category
     */
    getCategory(categoryName) {
        return this.roles.find(c => c.name === categoryName.toUpperCase());
    }
    /**
     * Whether a category exists or not
     * @param categoryName the category to check
     */
    categoryExists(categoryName) {
        return this.getCategory(categoryName) ? true : false;
    }
    /**
     * Adds a category
     * @param categoryName the category to add
     */
    addCategory(categoryName) {
        const newCategory = new role_category_1.RoleCategory;
        newCategory.name = categoryName;
        this.roles.push(newCategory);
    }
    /**
     * Removes a category
     * @param categoryName the category to remove
     */
    removeCategory(categoryName) {
        const category = this.getCategory(categoryName);
        this.roles.splice(this.roles.indexOf(category), 1);
    }
    /**
     * Gets the role from a specified category
     * @param categoryName the category you want to check
     * @param roleId the ID of the role
     */
    getRoleInCategory(categoryName, roleId) {
        return this.getCategory(categoryName).roles.find(r => r.id === roleId);
    }
    /**
     * Checks whether a role is in a certain category
     * @param categoryName The name of the category
     * @param roleId The id of the role
     */
    roleIsInCategory(categoryName, roleId) {
        return this.getRoleInCategory(categoryName, roleId) ? true : false;
    }
    /**
     * Adds a role to a category
     * @param categoryName the category to add the role to
     * @param roleId the ID of the role
     */
    addRole(categoryName, roleId) {
        const category = this.getCategory(categoryName);
        const newRole = new role_config_1.RoleConfig;
        newRole.id = roleId;
        this.roles[this.roles.indexOf(category)].roles.push(newRole);
    }
    /**
     * Removes a role from a category
     * @param categoryName the category to remove the role from
     * @param roleId the ID of the role
     */
    removeRole(categoryName, roleId) {
        const category = this.getCategory(categoryName);
        const role = category.roles.find(r => r.id === roleId);
        const categoryIndex = this.roles.indexOf(category);
        this.roles[categoryIndex].roles.splice(this.roles[categoryIndex].roles.indexOf(role), 1);
    }
    /**
     * Checks if a role is self-assignable
     * @param roleId the ID of the role
     */
    isSelfAssignable(roleId) {
        for (let i = 0; i < this.roles.length; i++) {
            for (let j = 0; j < this.roles[i].roles.length; j++) {
                if (this.roles[i].roles[j].id === roleId)
                    return true;
            }
        }
        return false;
    }
    /**
     * Checks whether a role config exists
     * @param messageId id of the message
     * @param emote emoji identifier
     */
    emoteExists(messageId, emote) {
        for (let i = 0; i < this.roles.length; i++) {
            for (let j = 0; j < this.roles[i].roles.length; j++) {
                let emoteReact = this.roles[i].roles[j].emoteReacts.find(e => e.messageId === messageId && e.emote === emote);
                if (emoteReact)
                    return true;
            }
        }
        return false;
    }
    /**
     * Adds a reaction role
     * @param categoryName The category the role is in
     * @param roleId The id of the role
     * @param messageId The id of the message
     * @param emote The emote identifier
     */
    addEmote(categoryName, roleId, messageId, channelId, emote) {
        const categoryIndex = this.roles.indexOf(this.getCategory(categoryName));
        for (let i = 0; i < this.roles[categoryIndex].roles.length; i++) {
            if (this.roles[categoryIndex].roles[i].id === roleId) {
                this.roles[categoryIndex].roles[i].emoteReacts.push(new role_react_1.RoleReact(emote, messageId, channelId));
                break;
            }
        }
    }
    /**
     * Removes the configs for reacts
     * @param categoryName Category the role is in
     * @param roleId Id of the role
     * @param indexes Which index in the array to remove
     */
    removeEmotes(categoryName, roleId, indexes) {
        indexes.sort((a, b) => b - a);
        const configToRemove = {};
        const categoryIndex = this.roles.indexOf(this.getCategory(categoryName));
        for (let i = 0; i < this.roles[categoryIndex].roles.length; i++) {
            if (this.roles[categoryIndex].roles[i].id === roleId) {
                indexes.forEach(index => {
                    if (index > this.roles[categoryIndex].roles[i].emoteReacts.length) {
                        return;
                    }
                    let id = `${this.roles[categoryIndex].roles[i].emoteReacts[index - 1].messageId}|${this.roles[categoryIndex].roles[i].emoteReacts[index - 1].channelId}`;
                    if (!configToRemove[id]) {
                        configToRemove[id] = [];
                    }
                    configToRemove[id].push(new message_reactions_config_1.ReactionConf(this.roles[categoryIndex].roles[i].emoteReacts[index - 1].emote, ''));
                    this.roles[categoryIndex].roles[i].emoteReacts.splice(index - 1, 1);
                });
            }
        }
        const messageReactionsConfig = [];
        for (let id in configToRemove) {
            let messageReactionsConf = new message_reactions_config_1.MessageReactionsConfig();
            let idSplit = id.split('|');
            messageReactionsConf.messageId = idSplit[0];
            messageReactionsConf.channelId = idSplit[1];
            messageReactionsConf.reactions = configToRemove[id];
            messageReactionsConfig.push(messageReactionsConf);
        }
        return messageReactionsConfig;
    }
    /**
     * Gets the role ID associated with a role react config
     * @param messageId the ID of the message
     * @param emoteIdentifier Emote identifier or name in case of unicode emojis
     */
    getReactRole(messageId, emoteIdentifier) {
        const categorys = this.getCategories();
        for (let i = 0; i < categorys.length; i++) {
            let category = this.getCategory(categorys[i]);
            for (let j = 0; j < category.roles.length; j++) {
                if (category.roles[j].emoteReacts.find(e => e.emote === emoteIdentifier && e.messageId === messageId)) {
                    return category.roles[j].id;
                }
            }
        }
    }
    /**
     * Returns all category names
     */
    getCategories() {
        const categories = [];
        for (let i = 0; i < this.roles.length; i++) {
            categories.push(this.roles[i].name);
        }
        return categories;
    }
    /**
     * Changes the name of a category
     * @param oldName The current category name
     * @param newName What you want to change the category name to
     */
    changeCategoryName(oldName, newName) {
        for (let i = 0; i < this.roles.length; i++) {
            if (this.roles[i].name === oldName) {
                this.roles[i].name = newName;
            }
        }
    }
    /**
     * Removes everything associated with a channel id
     * @param channelId The id of the channel
     */
    handleRemovedChannel(channelId) {
        for (let i = 0; i < this.roles.length; i++) {
            for (let j = 0; j < this.roles[i].roles.length; j++) {
                for (let k = 0; k < this.roles[i].roles[j].emoteReacts.length; k++) {
                    if (this.roles[i].roles[j].emoteReacts[k].channelId === channelId) {
                        this.roles[i].roles[j].emoteReacts.splice(k, 1);
                    }
                }
            }
        }
    }
    /**
     * Removes everything associated with a message id
     * @param messageId The id of the message
     */
    handleRemovedMessage(messageId) {
        for (let i = 0; i < this.roles.length; i++) {
            for (let j = 0; j < this.roles[i].roles.length; j++) {
                for (let k = 0; k < this.roles[i].roles[j].emoteReacts.length; k++) {
                    if (this.roles[i].roles[j].emoteReacts[k].messageId === messageId) {
                        this.roles[i].roles[j].emoteReacts.splice(k, 1);
                    }
                }
            }
        }
    }
    /**
     * Removes everything associated with the id of a role
     * @param roleId The id of the role
     */
    handleRemovedRole(roleId) {
        for (let i = 0; i < this.roles.length; i++) {
            for (let j = 0; j < this.roles[i].roles.length; j++) {
                if (this.roles[i].roles[j].id === roleId) {
                    this.roles[i].roles.splice(j, 1);
                }
            }
        }
    }
    /**
     * Gets all reactions
     */
    getAllReactions() {
        const messageReactions = {};
        this.roles.forEach(category => {
            category.roles.forEach(role => {
                role.emoteReacts.forEach(emoteReact => {
                    const id = `${emoteReact.messageId}|${emoteReact.channelId}`;
                    if (!messageReactions[id]) {
                        messageReactions[id] = [];
                    }
                    messageReactions[id].push(new message_reactions_config_1.ReactionConf(emoteReact.emote, role.id));
                });
            });
        });
        const messageReactionsConfig = [];
        for (let id in messageReactions) {
            let messageReactionsConf = new message_reactions_config_1.MessageReactionsConfig();
            let idSplit = id.split('|');
            messageReactionsConf.messageId = idSplit[0];
            messageReactionsConf.channelId = idSplit[1];
            messageReactionsConf.reactions = messageReactions[id];
            messageReactionsConfig.push(messageReactionsConf);
        }
        return messageReactionsConfig;
    }
    /**
     * Removes everything associated with a emoteIdentifier & messageId combination
     * @param emoteIdentifier The identifier of the emote
     * @param messageId The id of the message
     */
    handleReactionRemove(emoteIdentifier, messageId) {
        for (let i = 0; i < this.roles.length; i++) {
            for (let j = 0; j < this.roles[i].roles.length; j++) {
                for (let k = 0; k < this.roles[i].roles[j].emoteReacts.length; k++) {
                    if (this.roles[i].roles[j].emoteReacts[k].messageId === messageId && this.roles[i].roles[j].emoteReacts[k].emote === emoteIdentifier) {
                        this.roles[i].roles[j].emoteReacts.splice(k, 1);
                    }
                }
            }
        }
    }
}
exports.SelfAssign = SelfAssign;
