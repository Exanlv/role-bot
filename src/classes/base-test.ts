import { OutputList } from '@classes/outputList';
import { RunCommandOptions } from '@classes/runcommand-options';
import { ServerConfig } from '@classes/server-config';
import { RoleBot } from '@core/bot-roles';
import { Client, Guild, Message, TextChannel } from 'discord.js';

export class BaseTest {

	public roleBot: RoleBot;
	protected name: string;
	protected client: Client;

	protected testServer: Guild;
	protected testChannel: TextChannel;

	protected serverConfig: ServerConfig;
	protected rawConfig: any;

	constructor(client: Client, testServer: Guild, testChannel: TextChannel, roleBot: RoleBot) {
		this.client = client;
		this.testServer = testServer;
		this.testChannel = testChannel;
		this.roleBot = roleBot;
	}

	protected resultTest(testCode: string, status: boolean): void {
		if (status) {
			this.completedTest(testCode);
		} else {
			this.failedTest(testCode);
		}
	}

	protected completedTest(testName: string): void {
		console.log(`'${this.name}': Passed test '${testName}'`);
	}

	protected failedTest(testName: string): void {
		throw new Error(`'${this.name}': FAILED TEST '${testName}'`);
	}

	protected async runCommand(command: string, options: RunCommandOptions = {}): Promise<Message|boolean> {
		const time = options.time || 15000;
		const channel = options.channel || this.testChannel;
		const expectedResponse = options.response;

		channel.send(command);
		const message = (await channel.awaitMessages((m: Message) => m.author.id === this.roleBot.client.user.id, {maxMatches: 1, time})).first() as Message || null;

		if (!message) {
			return false;
		}

		if (expectedResponse) {
			return options.caseSensitive ? message.content.toLowerCase() === expectedResponse.toLowerCase() : message.content === expectedResponse;
		}

		return message;
	}

	protected async simpleTest(command: string, output: string, testName: string, options: RunCommandOptions = {}): Promise<void> {
		options.response = output;
		if (await this.runCommand(command, options)) {
			this.completedTest(testName);
		} else {
			this.failedTest(testName);
		}
	}

	protected async simpleTestDoubleResponse(command: string, output: string, secondOutput: string, testName: string, options: RunCommandOptions = {}): Promise<void> {
		options.response = output;
		if (await this.runCommand(command, options)) {
			options.response = secondOutput;
			if (await this.runCommand('~~exit', options)) {
				this.completedTest(testName);
				return;
			}
		}

		this.failedTest(testName);
	}

	protected async simpleTestList(command: string, output: OutputList[], testName: string, options: RunCommandOptions = {}): Promise<void> {
		options.response = null;
		const message = await this.runCommand(command, options) as Message;

		if (message.embeds[0].fields.length < output.length) {
			this.failedTest(testName);
			return;
		}

		for (let i = 0; i < output.length; i++) {
			if ((output[i].listTitle && (options.caseSensitive ? output[i].listTitle !== message.embeds[0].fields[i].name : output[i].listTitle.toUpperCase() !== message.embeds[0].fields[i].name.toUpperCase())) || (output[i].listValue && (options.caseSensitive ? output[i].listValue !== message.embeds[0].fields[i].name : output[i].listValue.toUpperCase() !== message.embeds[0].fields[i].value.toUpperCase()))) {
				this.failedTest(testName);
				return;
			}
		}

		this.completedTest(testName);
	}
}

export interface IUnitTest {
	name: string;
	runTests(): Promise<void>;
}
