import { SelfAssign } from '@classes/self-assign';
import { existsSync, readFileSync, unlink, writeFileSync } from 'fs';

export class ServerConfig {
	public prefix: string = ';;';
	public activeChannels: string[] = [];
	public adminRoles: string[] = [];
	public selfAssign: SelfAssign = new SelfAssign();
	public logChannel: string;
	private serverId: string;
	private confDir: string;

	constructor(id: string, dataDir: string) {
		this.confDir = dataDir;
		this.serverId = id;
		if (!existsSync(`${this.confDir}/${this.serverId}.json`)) {
			this.saveConfig();
			return;
		} else {
			const savedConfig = JSON.parse(readFileSync(`${this.confDir}/${this.serverId}.json`).toString());
			this.prefix = savedConfig.prefix || ';;';
			this.activeChannels = savedConfig.activeChannels;
			this.adminRoles = savedConfig.adminRoles;
			this.selfAssign = new SelfAssign(savedConfig.selfAssign);
			this.logChannel = savedConfig.logChannel;
		}

		this.selfAssign.on('ValuesChanged', () => {
			this.saveConfig();
		});
	}

	public getRaw(): {} {
		return {
			prefix : this.prefix,
			activeChannels: this.activeChannels,
			adminRoles: this.adminRoles,
			selfAssign: this.selfAssign.raw(),
			logChannel: this.logChannel,
		};
	}

	/**
	 * Saves the config to disk
	 * @param id Id of the guild
	 */
	public saveConfig(conf: {} = null): void {
		writeFileSync(`${this.confDir}/${this.serverId}.json`, JSON.stringify(conf || this.getRaw()));
	}

	public delete(): void {
		if (existsSync(`${this.confDir}/${this.serverId}.json`)) {
			unlink(`${this.confDir}/${this.serverId}.json`, (err: any) => {
				if (err) {
					console.log(err);
				}
			});
		}
	}

	/**
	 * Sets the public prefix for the current server
	 * @param prefix
	 */
	public setPrefix(prefix: string): void {
		if (this.prefix === prefix) {
			return;
		}

		this.prefix = prefix;
		this.saveConfig();
	}

	/**
	 * Whether a channel is an active channel or not
	 * @param id channel ID of the channel you want to check
	 */
	public isActiveChannel(id: string): boolean {
		return this.activeChannels.includes(id);
	}

	/**
	 * Removes a channel from the active channels
	 * @param id id of the channel you want to remove
	 */
	public removeActiveChannel(id: string): void {
		this.activeChannels.splice(this.activeChannels.indexOf(id), 1);
		this.saveConfig();
	}

	/**
	 * Adds a channel to active channels
	 * @param id id of the channel you want to add
	 */
	public addActiveChannel(id: string): void {
		this.activeChannels.push(id);
		this.saveConfig();
	}

	public setLogChannel(channelId: string): void {
		this.logChannel = channelId;
		this.saveConfig();
	}

	public reset(): void {
		this.prefix = ';;';
		this.activeChannels = [];
		this.adminRoles = [];
		this.selfAssign = new SelfAssign();
		this.saveConfig();
	}
}
