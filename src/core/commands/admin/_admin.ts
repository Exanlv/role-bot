import { ServerConfig } from '../../server-config';
import { BaseCommand } from "../../base-command";
import { Message, Client } from 'discord.js';

export class AdminCommand extends BaseCommand {
	constructor(message: Message, serverConfig: ServerConfig, command: string, args: Array<string>, client: Client) {
		super(message, serverConfig, command, args, client);
	}
}