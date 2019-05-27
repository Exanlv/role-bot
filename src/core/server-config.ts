import { existsSync, readFileSync, writeFileSync } from 'fs';
import { GlobalConfig } from "../global-config";
import { SelfAssign } from "../shared/classes/self-assign";

export class ServerConfig {
	private serverId: string;
	public prefix: string = ';;';
	public activeChannels: Array<string> = [];
	public adminRoles: Array<string> = [];
	public selfAssign: SelfAssign = new SelfAssign;

	constructor(id: string) {
		this.serverId = id;
		if (!existsSync(`${GlobalConfig.dataDir}/configs/${this.serverId}.json`)) {
			this.saveConfig();
			return;
		} else {
			const savedConfig = JSON.parse(readFileSync(`${GlobalConfig.dataDir}/configs/${this.serverId}.json`).toString());
			this.prefix = savedConfig.prefix;
			this.activeChannels = savedConfig.activeChannels;
			this.adminRoles = savedConfig.adminRoles;
			this.selfAssign = new SelfAssign(savedConfig.selfAssign);
		}
	}

	/**
	 * Saves the config to disk
	 * @param id Id of the guild
	 */
	public saveConfig() {
		writeFileSync(`${GlobalConfig.dataDir}/configs/${this.serverId}.json`, JSON.stringify({
			'prefix' : this.prefix,
			'activeChannels': this.activeChannels,
			'adminRoles': this.adminRoles,
			'selfAssign': this.selfAssign.raw()
		}));
	}

	/**
	 * Sets the public prefix for the current server
	 * @param prefix 
	 */
	public setPrefix(prefix: string) {
		if (this.prefix === prefix)
			return;

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
}