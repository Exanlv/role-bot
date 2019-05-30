import { Guild, TextChannel, Message } from "discord.js";
import { getBotResponse } from "..";

export async function testActiveChannels(server: Guild, testChannel: TextChannel) {
	if (await getBotResponse(testChannel, '!rbt ac', 'There are no active channels')) {
		console.log('Active Channels - No active channels list: FAILED');
		return false;
	}

	console.log('Active Channels - No active channels list: SUCCESS');

	const newChannel = await server.createChannel('AUTO-TEST', 'text') as TextChannel;
	try {
		if (await getBotResponse(testChannel, `!rbt ac a <#${newChannel.id}>`, 'Added channel ``auto-test`` as active channel')) {
			console.log('Active Channels - Add active channel: FAILED');
			return false;
		}
	
		console.log('Active Channels - Add active channel: SUCCESS');

		if (await getBotResponse(testChannel, `!rbt ac a <#${newChannel.id}>`)) {
			console.log('Active Channels - No response inactive channels: FAILED');
			return false;
		}
	
		console.log('Active Channels - No response inactive channels: SUCCESS');

		const acList = await getBotResponse(newChannel, '!rbt ac');
		if (!acList || (acList as Message).embeds.length < 1 || (acList as Message).embeds[0].fields[0].value !== '- auto-test') {
			console.log('Active Channels - Active channels list: FAILED');
			return;
		}
	
		console.log('Active Channels - Active channels list: SUCCESS');

		if (await getBotResponse(newChannel, `!rbt ac a <#${newChannel.id}>`, 'Could not add channel as active channel; this channel already is an active channel')) {
			console.log('Active Channels - Add active channel twice: FAILED');
			return false;
		}
	
		console.log('Active Channels - Add active channel twice: SUCCESS');

		if (await getBotResponse(newChannel, `!rbt ac r <#${newChannel.id}>`, 'Removed channel ``auto-test`` from active channels')) {
			console.log('Active Channels - Remove active channel: FAILED');
			return false;
		}
	
		console.log('Active Channels - Remove active channel: SUCCESS');

		if (await getBotResponse(newChannel, `!rbt ac r <#${newChannel.id}>`, 'Could not remove channel from active channels; this channel is not an active channel')) {
			console.log('Active Channels - Remove active channel twice: FAILED');
			return false;
		}
	
		console.log('Active Channels - Remove active channel twice: SUCCESS');
	} catch (err) {
		console.log(err);
	}
	
	await newChannel.delete();

	if (await getBotResponse(testChannel, '!rbt ac a <#12345>', 'Could not add channel as active channel; this channel does not exist')) {
		console.log('Active Channels - Add invalid channel: FAILED');
		return false;
	}

	console.log('Active Channels - Add invalid channel: SUCCESS');

	if (await getBotResponse(testChannel, '!rbt ac r <#12345>', 'Could not remove channel from active channels; this channel does not exist')) {
		console.log('Active Channels - Remove invalid channel: FAILED');
		return false;
	}

	console.log('Active Channels - Remove invalid channel: SUCCESS');

	return true;
}