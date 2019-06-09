import { existsSync, readFileSync, writeFileSync, unlink } from 'fs';
import { GlobalConfig } from "../global-config";
import { SelfAssign } from "../shared/classes/self-assign";

export class ServerConfig {
	private serverId: string;
	public prefix: string = ';;';
	public activeChannels: Array<string> = [];
	public adminRoles: Array<string> = [];
	public selfAssign: SelfAssign = new SelfAssign;
	public confDir: string;

	constructor(id: string, dataDir: string) {
		this.confDir = dataDir;
		this.serverId = id;
		if (!existsSync(`${this.confDir}/${this.serverId}.json`)) {
			this.saveConfig();
			return;
		} else {
			const savedConfig = JSON.parse(readFileSync(`${this.confDir}/${this.serverId}.json`).toString());
			this.prefix = savedConfig.prefix;
			this.activeChannels = savedConfig.activeChannels;
			this.adminRoles = savedConfig.adminRoles;
			this.selfAssign = new SelfAssign(savedConfig.selfAssign);
		}
	}

	public getRaw() {
		return {
			'prefix' : this.prefix,
			'activeChannels': this.activeChannels,
			'adminRoles': this.adminRoles,
			'selfAssign': this.selfAssign.raw()
		};
	}

	/**
	 * Saves the config to disk
	 * @param id Id of the guild
	 */
	public saveConfig(conf = null) {
		writeFileSync(`${this.confDir}/${this.serverId}.json`, JSON.stringify(conf || this.getRaw()));
	}

	public delete() {
		if (existsSync(`${this.confDir}/${this.serverId}.json`)) {
			unlink(`${this.confDir}/${this.serverId}.json`, err => {
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

	public reset() {
		this.prefix = ';;';
		this.activeChannels = [];
		this.adminRoles = [];
		this.selfAssign = new SelfAssign;
		this.saveConfig();
	}
}