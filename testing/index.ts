import { Client, TextChannel, Guild } from 'discord.js';
import { ActiveChannelsTest } from './tests/active-channels';
import { ModRolesTest } from './tests/mod-roles';
import { RoleBot } from '../src/bot';
import { GlobalConfig } from '../src/global-config';
import { PrefixTest } from './tests/prefix';

export function sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

class TestingBot {
	private client: Client;

	private testServer: Guild;
	private testChannel: TextChannel;

	private roleBot: RoleBot;

	constructor(token: string) {
		this.client = new Client();

		this.client.on('ready', async () => {
			console.log('Bot logged in');

			this.testServer = this.client.guilds.find(g => g.id === '575395886117421083');
			this.testChannel = this.testServer.channels.find(c => c.id === '577119668448526359') as TextChannel;

			await this.runTests();
			process.exit();
		});

		this.roleBot = new RoleBot(GlobalConfig.token);

		this.roleBot.on('BotReady', () => {
			console.log('Role Bot is ready');

			this.client.login(token);
		});
	}

	private async runTests() {
		const tests = [];

		tests.push(new ActiveChannelsTest(this.client, this.testServer, this.testChannel));
		tests.push(new ModRolesTest(this.client, this.testServer, this.testChannel));
		tests.push(new PrefixTest(this.client, this.testServer, this.testChannel));

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

new TestingBot('NTgzMzI3OTMxOTU5NjA3Mjk3.XO6xnQ.Fri4M80_9Ie0my2GS0e2zFls5XQ');