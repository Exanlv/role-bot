import { Client, TextChannel, Message, Guild } from 'discord.js';
import { testActiveChannels } from './tests/active-channels';
import { ServerConfig } from '../src/core/server-config';
import { testModRoles } from './tests/mod-roles';

export function sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export async function getBotResponse(channel: TextChannel, message: string, expectedResponse: string = null): Promise<Message|boolean> {
	await channel.send(message);

	const responseMessage = (await channel.awaitMessages(m => m.author.id === '573067073761312787', {maxMatches: 1, time: 15000})).first() as Message || false;

	if (!expectedResponse)
		return responseMessage;

	return (!responseMessage || responseMessage.content !== expectedResponse);
}

const client = new Client;
const testServerId = '575395886117421083';

client.on('ready', async () => {
	console.log('Test started');

	const testServer = client.guilds.find(g => g.id === testServerId);
	const testChannel = testServer.channels.find(c => c.id === '577119668448526359') as TextChannel;

	await runTest(testActiveChannels, testServer, testChannel);
	await runTest(testModRoles, testServer, testChannel);

	console.log('Bot passed all tests \\o/')
	process.exit();
});

async function runTest(func: Function, testServer: Guild, testChannel: TextChannel) {
	const serverConfig = new ServerConfig(testServerId);
	const confData = serverConfig.getRaw();
	serverConfig.reset();

	let result;

	try {
		result = await func(testServer, testChannel);
	} catch (err) {
		console.log(err);
	}

	serverConfig.saveConfig(confData);

	if (!result) {
		process.exit();
	}
}

client.login('NTgzMzI3OTMxOTU5NjA3Mjk3.XO6xnQ.Fri4M80_9Ie0my2GS0e2zFls5XQ');