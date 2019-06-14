import { Client, TextChannel, Guild } from 'discord.js';
import { ActiveChannelsTest } from './tests/active-channels';
import { ModRolesTest } from './tests/mod-roles';
import { getRolebot } from '../core/get-bots';
import { PrefixTest } from './tests/prefix';
import { readFileSync } from 'fs';
import { LogChannelTest } from './tests/log-channel';
import { SelfAssignCategoryTest } from './tests/selfassign-category';
import { SelfAssignRolesTest } from './tests/selfassign-roles';
import { SelfAssignEmotesTest } from './tests/selfassign-emotes';
import { RoleBot } from '../core/bot';

export function sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

class TestingBot {
	private client: Client;

	private testServer: Guild;
	private testChannel: TextChannel;

	private rootDir: string;

	private roleBot: RoleBot;

	constructor(token: string, rootDir) {
		this.client = new Client();

		this.rootDir = rootDir;

		this.client.on('ready', async () => {
			console.log('Bot logged in');

			this.testServer = this.client.guilds.find(g => g.id === this.roleBot.globalConfig.devServerId);
			this.testChannel = this.testServer.channels.find(c => c.name.toUpperCase() === 'TEST') as TextChannel;

			if (!this.testChannel) {
				throw(`No channel called 'test' on '${this.testServer.name}'`)
			}

			await this.runTests();
			process.exit();
		});

		this.roleBot = getRolebot();

		this.roleBot.on('BotReady', () => {
			console.log('Role Bot is ready');

			this.client.login(token);
		});
	}

	private async runTests() {
		const tests = [];

		tests.push(new ActiveChannelsTest(this.client, this.testServer, this.testChannel, this.roleBot));
		tests.push(new ModRolesTest(this.client, this.testServer, this.testChannel, this.roleBot));
		tests.push(new PrefixTest(this.client, this.testServer, this.testChannel, this.roleBot));
		tests.push(new LogChannelTest(this.client, this.testServer, this.testChannel, this.roleBot));
		tests.push(new SelfAssignCategoryTest(this.client, this.testServer, this.testChannel, this.roleBot));
		tests.push(new SelfAssignRolesTest(this.client, this.testServer, this.testChannel, this.roleBot));
		tests.push(new SelfAssignEmotesTest(this.client, this.testServer, this.testChannel, this.roleBot));

		for(let i = 0; i < tests.length; i++) {
			const currentConfig = this.roleBot.configs[this.testServer.id].getRaw();
			this.roleBot.configs[this.testServer.id].reset();

			try {
				await tests[i].runTests();
			} catch(err) {
				console.log(err);
			}

			if (tests[i].cleanUp)
				await tests[i].cleanUp();

			this.roleBot.configs[this.testServer.id].saveConfig(currentConfig);

			await sleep(1500);
		}
	}
}

const rootDir = (() => {
	let dir = __dirname.split('\\');
	dir.splice(dir.length - 1, 1);
	return dir.join('/');
})();

new TestingBot(readFileSync(`${rootDir}/settings/tokens/testing.txt`).toString(), rootDir);