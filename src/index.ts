import { Client, TextChannel } from 'discord.js';
import { GlobalConfig } from './global-config';
import { ServerConfig } from './core/server-config';
import { unlink, existsSync } from 'fs';
import { ShortReact } from './shared/classes/short-react';
import { handleMessage } from './core/handle-message';

const client: Client = new Client();

function setActivity() {
	client.user.setPresence({game : {name : `on ${client.guilds.size} guilds!`, type: 'WATCHING'}});
}
const prefix = {
	dev: GlobalConfig.developerPrefix,
	admin: GlobalConfig.adminPrefix
}

client.on('message', message => {
	handleMessage(message, client, prefix);
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
	setActivity();
});

client.on('guildCreate', guild => {
	setActivity();
});

client.on('error', console.error);

client.login(GlobalConfig.token)
	.catch(console.error)
;

const events = {
	MESSAGE_REACTION_ADD: 'ShortReactAdd',
	MESSAGE_REACTION_REMOVE: 'ShortReactRemove'
};

client.on('raw', async event => {
	if (!events.hasOwnProperty(event.t)) return;

	const shortReact = new ShortReact;

	if (!event.d.guild_id) {
		return;
	}

	shortReact.guild = client.guilds.find(g => g.id === event.d.guild_id);
	shortReact.member = shortReact.guild.members.find(m => m.id === event.d.user_id);
	shortReact.messageId = event.d.message_id;
	shortReact.emoteIdentifier = event.d.emoji.id ? `${event.d.emoji.name.split('~')[0]}:${event.d.emoji.id}` : event.d.emoji.name;

	client.emit(events[event.t], shortReact);
});

client.on('ShortReactAdd', (reaction: ShortReact) => {
	if (reaction.member.id === client.user.id) {
		return;
	}

	const serverConfig = new ServerConfig(reaction.guild.id);

	const reactRole = serverConfig.selfAssign.getReactRole(reaction.messageId, reaction.emoteIdentifier.toUpperCase());

	const guildRole = reaction.guild.roles.find(r => r.id === reactRole);

	if (!guildRole) {
		serverConfig.selfAssign.handleRemovedRole(reactRole);
		return;
	}

	reaction.member.addRole(guildRole).catch(e => {});
});

client.on('ShortReactRemove', (reaction: ShortReact) => {
	const serverConfig = new ServerConfig(reaction.guild.id);

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

	reaction.member.removeRole(guildRole).catch(e => {});
});

client.on('channelDelete', (channel: any) => {
	if (!channel.guild.id) {
		return;
	}

	const serverConfig = new ServerConfig(channel.guild.id);
	serverConfig.selfAssign.handleRemovedChannel(channel.id);
	serverConfig.saveConfig();
});

client.on('roleDelete', role => {
	const serverConfig = new ServerConfig(role.guild.id);
	serverConfig.selfAssign.handleRemovedRole(role.id);
	serverConfig.saveConfig();
});

client.on('guildDelete', guild => {
	setActivity();

	const path = `${GlobalConfig.dataDir}/configs/${guild.id}.json`;

	if (!existsSync(path))
		return;

	unlink(path, err => {
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

		const serverConfig = new ServerConfig(raw.d.guild_id);
		serverConfig.selfAssign.handleRemovedMessage(raw.d.id);
		serverConfig.saveConfig();
	}
});

client.on('guildMemberAdd', guildMember => {
	const serverConfig = new ServerConfig(guildMember.guild.id);

	serverConfig.selfAssign.getAllReactions().forEach(async messageReactionConfig => {
		const channel = guildMember.guild.channels.find(c => c.id === messageReactionConfig.channelId) as TextChannel;

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

				if(reaction.users.find(u => u.id === guildMember.id)) {
					guildMember.addRole(guildRole);
				}
			}
		});
	});
});