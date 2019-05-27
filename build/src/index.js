"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const global_config_1 = require("./global-config");
const base_command_1 = require("./core/base-command");
const server_config_1 = require("./core/server-config");
const fs_1 = require("fs");
const short_react_1 = require("./shared/classes/short-react");
const client = new discord_js_1.Client();
function setActivity() {
    client.user.setPresence({ game: { name: `on ${client.guilds.size} guilds!`, type: 'WATCHING' } });
}
const prefix = {
    dev: global_config_1.GlobalConfig.developerPrefix,
    admin: global_config_1.GlobalConfig.adminPrefix
};
client.on('message', message => {
    base_command_1.handleMessage(message, client, prefix);
});
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    setActivity();
});
client.on('guildCreate', guild => {
    setActivity();
});
client.on('error', console.error);
client.login(global_config_1.GlobalConfig.token)
    .catch(console.error);
const events = {
    MESSAGE_REACTION_ADD: 'ShortReactAdd',
    MESSAGE_REACTION_REMOVE: 'ShortReactRemove'
};
client.on('raw', async (event) => {
    if (!events.hasOwnProperty(event.t))
        return;
    const shortReact = new short_react_1.ShortReact;
    if (!event.d.guild_id) {
        return;
    }
    shortReact.guild = client.guilds.find(g => g.id === event.d.guild_id);
    shortReact.member = shortReact.guild.members.find(m => m.id === event.d.user_id);
    shortReact.messageId = event.d.message_id;
    shortReact.emoteIdentifier = event.d.emoji.id ? `${event.d.emoji.name.split('~')[0]}:${event.d.emoji.id}` : event.d.emoji.name;
    client.emit(events[event.t], shortReact);
});
client.on('ShortReactAdd', (reaction) => {
	if (!reaction.member) {
		return;
	}

    if (reaction.member.id === client.user.id) {
        return;
    }
    const serverConfig = new server_config_1.ServerConfig(reaction.guild.id);
    const reactRole = serverConfig.selfAssign.getReactRole(reaction.messageId, reaction.emoteIdentifier.toUpperCase());
    const guildRole = reaction.guild.roles.find(r => r.id === reactRole);
    if (!guildRole) {
        serverConfig.selfAssign.handleRemovedRole(reactRole);
        return;
    }
    reaction.member.addRole(guildRole).catch(e => { });
});
client.on('ShortReactRemove', (reaction) => {
    const serverConfig = new server_config_1.ServerConfig(reaction.guild.id);
    if (reaction.member.id === client.user.id) {
        serverConfig.selfAssign.handleReactionRemove(reaction.emoteIdentifier.toUpperCase(), reaction.messageId);
        serverConfig.saveConfig();
        return;
    }
    const reactRole = serverConfig.selfAssign.getReactRole(reaction.messageId, reaction.emoteIdentifier.toUpperCase());
    const guildRole = reaction.guild.roles.find(r => r.id === reactRole);
    if (!guildRole) {
        serverConfig.selfAssign.handleRemovedRole(reactRole);
        return;
    }
    reaction.member.removeRole(guildRole).catch(e => { });
});
client.on('channelDelete', (channel) => {
    if (!channel.guild.id) {
        return;
    }
    const serverConfig = new server_config_1.ServerConfig(channel.guild.id);
    serverConfig.selfAssign.handleRemovedChannel(channel.id);
    serverConfig.saveConfig();
});
client.on('roleDelete', role => {
    const serverConfig = new server_config_1.ServerConfig(role.guild.id);
    serverConfig.selfAssign.handleRemovedRole(role.id);
    serverConfig.saveConfig();
});
client.on('guildDelete', guild => {
    setActivity();
    const path = `${global_config_1.GlobalConfig.dataDir}/configs/${guild.id}.json`;
    if (!fs_1.existsSync(path))
        return;
    fs_1.unlink(path, err => {
        if (err) {
            console.error(err);
        }
    });
});
client.on('raw', raw => {
    if (raw.t === 'MESSAGE_DELETE') {
        if (!raw.d.guild_id) {
            return;
        }
        const serverConfig = new server_config_1.ServerConfig(raw.d.guild_id);
        serverConfig.selfAssign.handleRemovedMessage(raw.d.id);
        serverConfig.saveConfig();
    }
});
client.on('guildMemberAdd', guildMember => {
    const serverConfig = new server_config_1.ServerConfig(guildMember.guild.id);
    serverConfig.selfAssign.getAllReactions().forEach(async (messageReactionConfig) => {
        const channel = guildMember.guild.channels.find(c => c.id === messageReactionConfig.channelId);
        if (!channel) {
            serverConfig.selfAssign.handleRemovedChannel(messageReactionConfig.channelId);
            serverConfig.saveConfig();
            return;
        }
        const message = await channel.fetchMessage(messageReactionConfig.messageId);
        if (!message) {
            serverConfig.selfAssign.handleRemovedMessage(messageReactionConfig.messageId);
            serverConfig.saveConfig();
            return;
        }
        message.reactions.tap(reaction => {
            const role = messageReactionConfig.reactions.find(c => c.emoteIdentifier === (reaction.emoji.id ? reaction.emoji.identifier.toUpperCase() : reaction.emoji.name));
            if (role) {
                const guildRole = guildMember.guild.roles.find(r => r.id === role.roleId);
                if (!guildRole) {
                    serverConfig.selfAssign.handleRemovedRole(role.roleId);
                    serverConfig.saveConfig();
                    return;
                }
                if (reaction.users.find(u => u.id === guildMember.id)) {
                    guildMember.addRole(guildRole);
                }
            }
        });
    });
});
