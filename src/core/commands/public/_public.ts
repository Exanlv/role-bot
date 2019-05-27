import { Message, Client } from 'discord.js';
import { ServerConfig } from '../../server-config';
import { BaseCommand } from "../../base-command";

export class PublicCommand extends BaseCommand {
	constructor(message: Message, serverConfig: ServerConfig, command: string, args: Array<string>, client: Client) {
		super(message, serverConfig, command, args, client);
	}
}