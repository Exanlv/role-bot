import { Guild, Client, TextChannel, Message } from "discord.js";
import { RunCommandOptions } from "./classes/runcommand-options";
import { ServerConfig } from "../src/core/server-config";

export class BaseTest {
	protected name: string;
	protected client: Client;

	protected testServer: Guild;
	protected testChannel: TextChannel;

	protected serverConfig: ServerConfig;
	protected rawConfig: any;

	constructor(client: Client, testServer: Guild, testChannel: TextChannel) {
		this.client = client;
		this.testServer = testServer;
		this.testChannel = testChannel;
	}

	public startUp() {
		this.serverConfig = new ServerConfig(this.testServer.id);
		this.rawConfig = this.serverConfig.getRaw();
		this.serverConfig.reset();
	}

	public cleanUp() {
		this.serverConfig.saveConfig(this.rawConfig);
	}

	protected resultTest(testCode: string, status: boolean) {
		if (status)
			this.completedTest(testCode);
		else
			this.failedTest(testCode);
	}

	private completedTest(testName: string) {
		console.log(`'${this.name}': Passed test '${testName}'`);
	}

	private failedTest(testName: string) {
		throw `'${this.name}': FAILED TEST '${testName}'`;
	}

	protected async runCommand(command: string, options: RunCommandOptions = {}): Promise<Message|boolean> {
		const time = options.time || 15000;
		const channel = options.channel || this.testChannel;
		const expectedResponse = options.response;

		await channel.send(command)
		const message = (await channel.awaitMessages(m => m.author.id === '573067073761312787', {maxMatches: 1, time: time})).first() as Message || null;

		if (!message)
			return false;

		if (expectedResponse)
			return options.caseSensitive ? message.content.toLowerCase() === expectedResponse.toLowerCase() : message.content === expectedResponse;
		
		return message;
	}

	protected async simpleTest(command: string, output: string, testName: string, options: RunCommandOptions = {}) {
		options.response = output;
		if (await this.runCommand(command, options)) {
			this.completedTest(testName);
		} else {
			this.failedTest(testName);
		}
	}

	protected async simpleTestDoubleResponse(command: string, output: string, secondOutput: string, testName: string, options: RunCommandOptions = {}) {
		options.response = output;
		if (await this.runCommand(command, options)) {
			const channel = options.channel || this.testChannel;
			const message = (await channel.awaitMessages(m => m.author.id === '573067073761312787', {maxMatches: 1, time: 30000})).first() as Message || null;
			if (message && (options.caseSensitive ? message.content === secondOutput : message.content.toLowerCase() === secondOutput.toLowerCase())) {
				this.completedTest(testName);
				return;
			}
		}

		this.failedTest(testName);
	}
}

export interface UnitTest {
	name: string;
	runTests();
}