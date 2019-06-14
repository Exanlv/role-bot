import { BaseTest, UnitTest } from "../base-test";
import { TextChannel } from "discord.js";

export class LogChannelTest extends BaseTest implements UnitTest {
	public name: string = 'Log Channel';
	public logChannel: TextChannel;

	public async runTests() {
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}lc`,
			'No log channel is currently set',
			'Get no log channel'
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}lc s`,
			'Could not set log channel; no channel was given',
			'Setting no log channel'
		);

		this.logChannel = await this.testServer.createChannel('log-channel') as TextChannel;

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}lc s <#${this.logChannel.id}>`,
			`Succesfully set <#${this.logChannel.id}> as log channel!`,
			'Setting log channel'
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}lc s <#${this.logChannel.id}>`,
			`Could not set log channel; <#${this.logChannel.id}> already is the log channel`,
			'Setting log channel twice'
		);
	}

	public cleanUp() {
		if (this.logChannel && this.logChannel.deletable) {
			this.logChannel.delete();
		}
	}
}