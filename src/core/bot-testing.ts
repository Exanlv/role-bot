import { ActiveChannelsTest } from '@bot-testing/tests/active-channels';
import { LogChannelTest } from '@bot-testing/tests/log-channel';
import { ModRolesTest } from '@bot-testing/tests/mod-roles';
import { PrefixTest } from '@bot-testing/tests/prefix';
import { SelfAssignCategoryTest } from '@bot-testing/tests/selfassign-category';
import { SelfAssignEmotesTest } from '@bot-testing/tests/selfassign-emotes';
import { SelfAssignRolesTest } from '@bot-testing/tests/selfassign-roles';
import { RoleBot } from '@core/bot-roles';
import { sleep } from '@core/functions';
import { getRolebot } from '@core/get-bots';
import { Client, Guild, GuildChannel, TextChannel } from 'discord.js';

export class TestingBot {
	private client: Client;

	private testServer: Guild;
	private testChannel: TextChannel;

	private rootDir: string;

	private roleBot: RoleBot;

	constructor(token: string, rootDir: string) {
		this.client = new Client();

		this.rootDir = rootDir;

		this.client.on('ready', async () => {
			console.log('Bot logged in');

			this.testServer = this.client.guilds.find((g: Guild) => g.id === this.roleBot.globalConfig.devServerId);
			this.testChannel = this.testServer.channels.find((c: GuildChannel) => c.name.toUpperCase() === 'TEST' && c.type === 'text') as TextChannel;

			if (!this.testChannel) {
				throw new Error((`No channel called 'test' on '${this.testServer.name}'`));
			}

			await this.runTests();
			process.exit();
		});

		this.roleBot = getRolebot(false);

		this.roleBot.on('BotReady', () => {
			console.log('Role Bot is ready');

			this.client.login(token);
		});
	}

	private async runTests(): Promise<void> {
		const tests = [];

		tests.push(new ActiveChannelsTest(this.client, this.testServer, this.testChannel, this.roleBot));
		tests.push(new ModRolesTest(this.client, this.testServer, this.testChannel, this.roleBot));
		tests.push(new PrefixTest(this.client, this.testServer, this.testChannel, this.roleBot));
		tests.push(new LogChannelTest(this.client, this.testServer, this.testChannel, this.roleBot));
		tests.push(new SelfAssignCategoryTest(this.client, this.testServer, this.testChannel, this.roleBot));
		tests.push(new SelfAssignRolesTest(this.client, this.testServer, this.testChannel, this.roleBot));
		tests.push(new SelfAssignEmotesTest(this.client, this.testServer, this.testChannel, this.roleBot));

		for (let i = 0; i < tests.length; i++) {
			const currentConfig = this.roleBot.configs[this.testServer.id].getRaw();
			this.roleBot.configs[this.testServer.id].reset();

			try {
				await tests[i].runTests();
			} catch (err) {
				console.log(err);
			}

			if (tests[i].cleanUp) {
				await tests[i].cleanUp();
			}

			this.roleBot.configs[this.testServer.id].saveConfig(currentConfig);

			await sleep(1500);
		}
	}
}
