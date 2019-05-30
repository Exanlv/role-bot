import { getCommandConfig } from "./command-configs";
import { CommandConfig } from '../shared/classes/command-config';
import { Message, Client } from "discord.js";
import { ServerConfig } from "./server-config";
import { GlobalConfig } from "../global-config";

export async function handleMessage(message: Message, client: Client, prefixes: any) {
	if (message.author.id === client.user.id || !message.guild) {
		return;
	}

	const serverConfig = new ServerConfig(message.guild.id);

	if (serverConfig.activeChannels.length && !serverConfig.activeChannels.includes(message.channel.id)) {
		return;
	}

	let command = message.content.toUpperCase();
	let mode;

	if (command.startsWith(prefixes.dev)) {
		if (!GlobalConfig.developers.includes(message.member.id)) {
			return;
		}

		mode = 'dev';
	} else if (command.startsWith(prefixes.admin)) {
		let confirmedAdmin = false;

		if (GlobalConfig.developers.includes(message.member.id) || message.member.hasPermission('ADMINISTRATOR')) {
			confirmedAdmin = true;
		}

		for (let i = 0; i < serverConfig.adminRoles.length && !confirmedAdmin; i++) {
			if (message.member.roles.some((memberRole) => {return memberRole.id === serverConfig.adminRoles[i]})) {
				confirmedAdmin = true;
			}
		}

		if (!confirmedAdmin) {
			return;
		}

		mode = 'admin';
	} else if (command.startsWith(serverConfig.prefix)) {
		mode = 'public';	
	} else {
		return;
	}

	const prefix = {admin: prefixes.admin, public: serverConfig.prefix, dev: prefixes.dev}[mode];
	command = removePrefix(command, prefix);
	const args = command.split(' ');

	const CommandConfig: CommandConfig|false = getCommandConfig(mode, args);

	if(!CommandConfig) {
		message.channel.send(`Invalid command! Use \`\`${prefix}help\`\` for a list of commands`);
		return;
	}

	const classFile = await import(`./commands/${mode}/${CommandConfig.filePath}`).catch(console.error);
	if (!classFile)
		return;

	if (!classFile[CommandConfig.className]) {
		console.error(`Class ${CommandConfig.className} does not exist in ${mode}/${CommandConfig.filePath}`);
		return;
	}

	const commandInstance = new classFile[CommandConfig.className](message, serverConfig, command, args, client);
	commandInstance.runCommand();
}

function removePrefix(message: string, prefix: string) {
	return message.replace(prefix, '');
}
