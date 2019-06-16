import { MessageReactionsConfig } from '@classes/message-reactions-config';
import { RoleCategory } from '@classes/role-category';
import { RoleConfig } from '@classes/role-config';
import { RoleReact } from '@classes/role-react';
import { Role } from 'discord.js';
import { EventEmitter } from 'events';
import { ReactionConf } from '@classes/reaction-conf';

export class SelfAssign extends EventEmitter {
	private roles: RoleCategory[] = [];

	constructor(data?: RoleCategory[]) {
		super();

		if (data) {
			this.roles = data;
			return;
		}
	}

	/**
	 * Returns the roles as a raw array
	 */
	public raw(): RoleCategory[] {
		return this.roles;
	}

	/**
	 * Returns a category
	 * @param categoryName The name of the category
	 */
	public getCategory(categoryName: string): RoleCategory {
		return this.roles.find((c: RoleCategory) => c.name === categoryName.toUpperCase());
	}

	/**
	 * Whether a category exists or not
	 * @param categoryName the category to check
	 */
	public categoryExists(categoryName: string): boolean {
		return this.getCategory(categoryName) ? true : false;
	}

	/**
	 * Adds a category
	 * @param categoryName the category to add
	 */
	public addCategory(categoryName: string): void {
		const newCategory = new RoleCategory();
		newCategory.name = categoryName;
		this.roles.push(newCategory);
		this.emit('ValuesChanged');
	}

	/**
	 * Removes a category
	 * @param categoryName the category to remove
	 */
	public removeCategory(categoryName: string): void {
		const category = this.getCategory(categoryName);
		this.roles.splice(this.roles.indexOf(category), 1);
		this.emit('ValuesChanged');
	}

	/**
	 * Checks whether a role is in a certain category
	 * @param categoryName The name of the category
	 * @param roleId The id of the role
	 */
	public roleIsInCategory(categoryName: string, roleId: string): boolean {
		return this.getRoleInCategory(categoryName, roleId) ? true : false;
	}

	/**
	 * Adds a role to a category
	 * @param categoryName the category to add the role to
	 * @param roleId the ID of the role
	 */
	public addRole(categoryName: string, roleId: string): void {
		const category = this.getCategory(categoryName);
		const newRole = new RoleConfig();
		newRole.id = roleId;
		this.roles[this.roles.indexOf(category)].roles.push(newRole);
		this.emit('ValuesChanged');
	}

	/**
	 * Removes a role from a category
	 * @param categoryName the category to remove the role from
	 * @param roleId the ID of the role
	 */
	public removeRole(categoryName: string, roleId: string): void {
		const category = this.getCategory(categoryName);
		const role = category.roles.find((r: RoleConfig) => r.id === roleId);
		const categoryIndex = this.roles.indexOf(category);
		this.roles[categoryIndex].roles.splice(this.roles[categoryIndex].roles.indexOf(role), 1);
		this.emit('ValuesChanged');
	}

	/**
	 * Checks if a role is self-assignable
	 * @param roleId the ID of the role
	 */
	public isSelfAssignable(roleId: string): boolean {
		for (let i = 0; i < this.roles.length; i++) {
			for (let j = 0; j < this.roles[i].roles.length; j++) {
				if (this.roles[i].roles[j].id === roleId) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Checks whether a role config exists
	 * @param messageId id of the message
	 * @param emote emoji identifier
	 */
	public emoteExists(messageId: string, emote: string): boolean {
		for (let i = 0; i < this.roles.length; i++) {
			for (let j = 0; j < this.roles[i].roles.length; j++) {
				const emoteReact = this.roles[i].roles[j].emoteReacts.find((e: RoleReact) => e.messageId === messageId && e.emote === emote);
				if (emoteReact) {
					return true;
				}
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
	public addEmote(categoryName: string, roleId: string, messageId: string, channelId: string, emote: string): void {
		const categoryIndex = this.roles.indexOf(this.getCategory(categoryName));
		for (let i = 0; i < this.roles[categoryIndex].roles.length; i++) {
			if (this.roles[categoryIndex].roles[i].id === roleId) {
				this.roles[categoryIndex].roles[i].emoteReacts.push(new RoleReact(emote, messageId, channelId));
				break;
			}
		}
		this.emit('ValuesChanged');
	}

	/**
	 * Removes the configs for reacts
	 * @param categoryName Category the role is in
	 * @param roleId Id of the role
	 * @param indexes Which index in the array to remove
	 */
	public removeEmotes(categoryName: string, roleId: string, indexes: number[]): MessageReactionsConfig[] {
		indexes.sort((a: number, b: number) => b - a);

		const configToRemove = {};
		const categoryIndex = this.roles.indexOf(this.getCategory(categoryName));
		for (let i = 0; i < this.roles[categoryIndex].roles.length; i++) {
			if (this.roles[categoryIndex].roles[i].id === roleId) {
				indexes.forEach((index: number) => {
					if (index > this.roles[categoryIndex].roles[i].emoteReacts.length) {
						return;
					}
					const id = `${this.roles[categoryIndex].roles[i].emoteReacts[index - 1].messageId}|${this.roles[categoryIndex].roles[i].emoteReacts[index - 1].channelId}`;
					if (!configToRemove[id]) {
						configToRemove[id] = [];
					}
					configToRemove[id].push(new ReactionConf(this.roles[categoryIndex].roles[i].emoteReacts[index - 1].emote, ''));
					this.roles[categoryIndex].roles[i].emoteReacts.splice(index - 1, 1);
				});
			}
		}

		const messageReactionsConfig = [];
		for (const id in configToRemove) {
			const messageReactionsConf = new MessageReactionsConfig();
			const idSplit = id.split('|');
			messageReactionsConf.messageId = idSplit[0];
			messageReactionsConf.channelId = idSplit[1];
			messageReactionsConf.reactions = configToRemove[id];
			messageReactionsConfig.push(messageReactionsConf);
		}

		this.emit('ValuesChanged');
		return messageReactionsConfig;
	}

	/**
	 * Gets the role ID associated with a role react config
	 * @param messageId the ID of the message
	 * @param emoteIdentifier Emote identifier or name in case of unicode emojis
	 */
	public getReactRole(messageId: string, emoteIdentifier: string): string {
		const categorys = this.getCategories();

		for (let i = 0; i < categorys.length; i++) {
			const category = this.getCategory(categorys[i]);
			for (let j = 0; j < category.roles.length; j++) {
				if (category.roles[j].emoteReacts.find((e: RoleReact) => e.emote === emoteIdentifier && e.messageId === messageId)) {
					return category.roles[j].id;
				}
			}
		}
	}

	/**
	 * Returns all category names
	 */
	public getCategories(): string[] {
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
	public changeCategoryName(oldName: string, newName: string): void {
		for (let i = 0; i < this.roles.length; i++) {
			if (this.roles[i].name === oldName) {
				this.roles[i].name = newName;
			}
		}
		this.emit('ValuesChanged');
	}

	/**
	 * Removes everything associated with a channel id
	 * @param channelId The id of the channel
	 */
	public handleRemovedChannel(channelId: string): void {
		for (let i = 0; i < this.roles.length; i++) {
			for (let j = 0; j < this.roles[i].roles.length; j++) {
				for (let k = 0; k < this.roles[i].roles[j].emoteReacts.length; k++) {
					if (this.roles[i].roles[j].emoteReacts[k].channelId === channelId) {
						this.roles[i].roles[j].emoteReacts.splice(k, 1);
					}
				}
			}
		}
		this.emit('ValuesChanged');
	}

	/**
	 * Removes everything associated with a message id
	 * @param messageId The id of the message
	 */
	public handleRemovedMessage(messageId: string): void {
		for (let i = 0; i < this.roles.length; i++) {
			for (let j = 0; j < this.roles[i].roles.length; j++) {
				for (let k = 0; k < this.roles[i].roles[j].emoteReacts.length; k++) {
					if (this.roles[i].roles[j].emoteReacts[k].messageId === messageId) {
						this.roles[i].roles[j].emoteReacts.splice(k, 1);
					}
				}
			}
		}
		this.emit('ValuesChanged');
	}

	/**
	 * Removes everything associated with the id of a role
	 * @param roleId The id of the role
	 */
	public handleRemovedRole(roleId: string): void {
		for (let i = 0; i < this.roles.length; i++) {
			for (let j = 0; j < this.roles[i].roles.length; j ++) {
				if (this.roles[i].roles[j].id === roleId) {
					this.roles[i].roles.splice(j, 1);
				}
			}
		}
		this.emit('ValuesChanged');
	}

	/**
	 * Gets all reactions
	 */
	public getAllReactions(): MessageReactionsConfig[] {
		const messageReactions = {};
		this.roles.forEach((category: RoleCategory) => {
			category.roles.forEach((role: RoleConfig) => {
				role.emoteReacts.forEach((emoteReact: RoleReact) => {
					const id = `${emoteReact.messageId}|${emoteReact.channelId}`;
					if (!messageReactions[id]) {
						messageReactions[id] = [];
					}
					messageReactions[id].push(new ReactionConf(emoteReact.emote, role.id));
				});
			});
		});

		const messageReactionsConfig = [];
		for (const id in messageReactions) {
			const messageReactionsConf = new MessageReactionsConfig();
			const idSplit = id.split('|');
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
	public handleReactionRemove(emoteIdentifier: string, messageId: string): void {
		for (let i = 0; i < this.roles.length; i++) {
			for (let j = 0; j < this.roles[i].roles.length; j++) {
				for (let k = 0; k < this.roles[i].roles[j].emoteReacts.length; k++) {
					if (this.roles[i].roles[j].emoteReacts[k].messageId === messageId && this.roles[i].roles[j].emoteReacts[k].emote === emoteIdentifier) {
						this.roles[i].roles[j].emoteReacts.splice(k, 1);
					}
				}
			}
		}
		this.emit('ValuesChanged');
	}

	/**
	 * Swaps the position of two categories
	 * @param categoryOne first category
	 * @param categoryTwo second category
	 */
	public swapCategories(categoryOne: RoleCategory, categoryTwo: RoleCategory): void {
		const indexes = [this.roles.indexOf(categoryOne), this.roles.indexOf(categoryTwo)];
		this.roles[indexes[0]] = categoryTwo;
		this.roles[indexes[1]] = categoryOne;
		this.emit('ValuesChanged');
	}

	/**
	 * Gets the role from a specified category
	 * @param categoryName the category you want to check
	 * @param roleId the ID of the role
	 */
	protected getRoleInCategory(categoryName: string, roleId: string): RoleConfig {
		return this.getCategory(categoryName).roles.find((r: RoleConfig) => r.id === roleId);
	}
}
