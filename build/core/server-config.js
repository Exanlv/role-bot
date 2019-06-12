"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const self_assign_1 = require("../shared/classes/self-assign");
class ServerConfig {
    constructor(id, dataDir) {
        this.prefix = ';;';
        this.activeChannels = [];
        this.adminRoles = [];
        this.selfAssign = new self_assign_1.SelfAssign;
        this.confDir = dataDir;
        this.serverId = id;
        if (!fs_1.existsSync(`${this.confDir}/${this.serverId}.json`)) {
            this.saveConfig();
            return;
        }
        else {
            const savedConfig = JSON.parse(fs_1.readFileSync(`${this.confDir}/${this.serverId}.json`).toString());
            this.prefix = savedConfig.prefix || ';;';
            this.activeChannels = savedConfig.activeChannels;
            this.adminRoles = savedConfig.adminRoles;
            this.selfAssign = new self_assign_1.SelfAssign(savedConfig.selfAssign);
            this.logChannel = savedConfig.logChannel;
        }
        this.selfAssign.on('ValuesChanged', () => {
            this.saveConfig();
        });
    }
    getRaw() {
        return {
            'prefix': this.prefix,
            'activeChannels': this.activeChannels,
            'adminRoles': this.adminRoles,
            'selfAssign': this.selfAssign.raw(),
            'logChannel': this.logChannel
        };
    }
    /**
     * Saves the config to disk
     * @param id Id of the guild
     */
    saveConfig(conf = null) {
        fs_1.writeFileSync(`${this.confDir}/${this.serverId}.json`, JSON.stringify(conf || this.getRaw()));
    }
    delete() {
        if (fs_1.existsSync(`${this.confDir}/${this.serverId}.json`)) {
            fs_1.unlink(`${this.confDir}/${this.serverId}.json`, err => {
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
    setPrefix(prefix) {
        if (this.prefix === prefix)
            return;
        this.prefix = prefix;
        this.saveConfig();
    }
    /**
     * Whether a channel is an active channel or not
     * @param id channel ID of the channel you want to check
     */
    isActiveChannel(id) {
        return this.activeChannels.includes(id);
    }
    /**
     * Removes a channel from the active channels
     * @param id id of the channel you want to remove
     */
    removeActiveChannel(id) {
        this.activeChannels.splice(this.activeChannels.indexOf(id), 1);
        this.saveConfig();
    }
    /**
     * Adds a channel to active channels
     * @param id id of the channel you want to add
     */
    addActiveChannel(id) {
        this.activeChannels.push(id);
        this.saveConfig();
    }
    setLogChannel(channelId) {
        this.logChannel = channelId;
        this.saveConfig();
    }
    reset() {
        this.prefix = ';;';
        this.activeChannels = [];
        this.adminRoles = [];
        this.selfAssign = new self_assign_1.SelfAssign;
        this.saveConfig();
    }
}
exports.ServerConfig = ServerConfig;
