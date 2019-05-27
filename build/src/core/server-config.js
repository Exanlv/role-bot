"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const global_config_1 = require("../global-config");
const self_assign_1 = require("../shared/classes/self-assign");
class ServerConfig {
    constructor(id) {
        this.prefix = ';;';
        this.activeChannels = [];
        this.adminRoles = [];
        this.selfAssign = new self_assign_1.SelfAssign;
        this.serverId = id;
        if (!fs_1.existsSync(`${global_config_1.GlobalConfig.dataDir}/configs/${this.serverId}.json`)) {
            this.saveConfig();
            return;
        }
        else {
            const savedConfig = JSON.parse(fs_1.readFileSync(`${global_config_1.GlobalConfig.dataDir}/configs/${this.serverId}.json`).toString());
            this.prefix = savedConfig.prefix;
            this.activeChannels = savedConfig.activeChannels;
            this.adminRoles = savedConfig.adminRoles;
            this.selfAssign = new self_assign_1.SelfAssign(savedConfig.selfAssign);
        }
    }
    /**
     * Saves the config to disk
     * @param id Id of the guild
     */
    saveConfig() {
        fs_1.writeFileSync(`${global_config_1.GlobalConfig.dataDir}/configs/${this.serverId}.json`, JSON.stringify({
            'prefix': this.prefix,
            'activeChannels': this.activeChannels,
            'adminRoles': this.adminRoles,
            'selfAssign': this.selfAssign.raw()
        }));
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
}
exports.ServerConfig = ServerConfig;
