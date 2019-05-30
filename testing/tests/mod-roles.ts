import { Guild, TextChannel } from "discord.js";
import { getBotResponse } from "..";

export async function testModRoles(server: Guild, channel: TextChannel) {
	if (await getBotResponse(channel, '!rbt mr', 'There are no mod-roles')) {
		console.log('Mod Roles - No mod roles: FAILED');
		return false;
	}

	console.log('Mod Roles - No mod roles: SUCCESS');

	const testRole = await server.createRole({name: 'AUTO-TEST-ROLE'});

	try {
		if (await getBotResponse(channel, `!rbt mr a ${testRole.name}`, `Added role \`\`${testRole.name}\`\` as mod-role`)) {
			console.log('Mod Roles - Adding mod role: FAILED');
			return false;
		}
	
		console.log('Mod Roles - Adding mod role: SUCCESS');
	
		if (await getBotResponse(channel, `!rbt mr a ${testRole.name}`, `Could not add mod-role; role \`\`${testRole.name}\`\` is already a mod-role`)) {
			console.log('Mod Roles - Adding mod role twice: FAILED');
			return false;
		}
	
		console.log('Mod Roles - Adding mod role twice: SUCCESS');
	
		if (await getBotResponse(channel, `!rbt mr r ${testRole.name}`, `Removed role \`\`${testRole.name}\`\` from mod-roles`)) {
			console.log('Mod Roles - Removing mod role: FAILED');
			return false;
		}
	
		console.log('Mod Roles - Removing mod role: SUCCESS');
	
		if (await getBotResponse(channel, `!rbt mr r ${testRole.name}`, `Could not remove mod-role; role \`\`${testRole.name}\`\` is not a mod-role`)) {
			console.log('Mod Roles - Removing mod role twice: FAILED');
			return false;
		}
	} catch(err) {
		console.log(err);
	}

	testRole.delete();
	
	console.log('Mod Roles - Removing mod role twice: SUCCESS');

	if (await getBotResponse(channel, '!rbt mr a THIS-ROLE-DOES-NOT-EXIST', 'Could not add mod-role; role ``This-role-does-not-exist`` does not exist')) {
		console.log('Mod Roles - Adding invalid role: FAILED');
		return false;
	}

	console.log('Mod Roles - Adding invalid role: SUCCESS');

	if (await getBotResponse(channel, '!rbt mr r THIS-ROLE-DOES-NOT-EXIST', 'Could not remove mod-role; role ``This-role-does-not-exist`` does not exist')) {
		console.log('Mod Roles - Adding invalid role: FAILED');
		return false;
	}

	console.log('Mod Roles - Removing invalid role: SUCCESS');

	if (await getBotResponse(channel, '!rbt mr a', 'Could not add mod-role; no role name was provided')) {
		console.log('Mod Roles - Adding no role: FAILED');
		return false;
	}

	console.log('Mod Roles - Adding no role: SUCCESS');

	if (await getBotResponse(channel, '!rbt mr r', 'Could not remove mod-role; no role name was provided')) {
		console.log('Mod Roles - Removing no role: FAILED');
		return false;
	}

	console.log('Mod Roles - Removing no role: SUCCESS');

	return true;
}