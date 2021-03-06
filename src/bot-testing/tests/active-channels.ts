import { BaseTest, IUnitTest } from '@classes/base-test';
import { Message, TextChannel } from 'discord.js';

export class ActiveChannelsTest extends BaseTest implements IUnitTest {
	public name: string = 'Active Channels';
	private secondTestChannel: TextChannel;
	public async runTests(): Promise<void> {

		/**
		 * Tests the active channel list when theres no active channels set
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}ac`,
			'There are no active channels',
			'No active channels list',
		);

		/**
		 *
		 */
		this.secondTestChannel = await this.testServer.createChannel('AUTO-TEST', 'text') as TextChannel;

		/**
		 * Tests adding an active channel
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}ac a <#${this.secondTestChannel.id}>`,
			`Added channel \`\`${this.secondTestChannel.name}\`\` as active channel`,
			'Add active channel',
		);

		/**
		 * Tests whether the bot responds in inactive channels
		 */
		this.resultTest('No response in inactive channels', !(await this.runCommand(`${this.roleBot.globalConfig.prefixes.admin}ac`, {time: 5000}) as boolean));

		/**
		 * Tests the active channels list command
		 */
		await this.activeChannelListTest('Active channels list');

		/**
		 * Tests adding a channel twice as active channel
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}ac a <#${this.secondTestChannel.id}>`,
			'Could not add channel as active channel; this channel already is an active channel',
			'Add active channel twice',
			{channel: this.secondTestChannel},
		);

		/**
		 * Tests removing a channel from active channels
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}ac r <#${this.secondTestChannel.id}>`,
			`Removed channel \`\`${this.secondTestChannel.name}\`\` from active channels`,
			'Remove active channel',
			{channel: this.secondTestChannel},
		);

		/**
		 * Tests removing a channel from active channels twice
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}ac r <#${this.secondTestChannel.id}>`,
			'Could not remove channel from active channels; this channel is not an active channel',
			'Remove active channel',
		);

		/**
		 * Tests adding an invalid channel to active channels
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}ac a <#12345>`,
			'Could not add channel as active channel; this channel does not exist',
			'Add invalid channel',
		);

		/**
		 * Tests removing an invalid channel to active channels
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}ac r <#12345>`,
			'Could not remove channel from active channels; this channel does not exist',
			'Remove invalid channel',
		);
	}

	public async cleanUp(): Promise<void> {
		if (this.secondTestChannel) {
			await this.secondTestChannel.delete();
		}
	}

	private async activeChannelListTest(testCode: string): Promise<void> {
		const message = await this.runCommand(`${this.roleBot.globalConfig.prefixes.admin}ac`, {channel: this.secondTestChannel}) as Message;
		this.resultTest(testCode, !(typeof message === 'boolean' || (message as Message).embeds.length < 1 || (message as Message).embeds[0].fields[0].value !== `- ${this.secondTestChannel.name}`));
	}
}
