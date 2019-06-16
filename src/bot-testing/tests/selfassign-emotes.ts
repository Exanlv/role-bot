import { BaseTest, IUnitTest } from '@classes/base-test';
import { firstLetterUppercase } from '@core/functions';
import { Message, Role } from 'discord.js';

export class SelfAssignEmotesTest extends BaseTest implements IUnitTest {
	public name: string = 'Self Assign Emotes';

	public testingRole: Role;

	public testingMessage: Message;

	public categoryName: string = 'Whatever';
	public secondCategoryName: string = 'Whatever123';

	public fakeRole: string = 'tygudahnjiwawd234';
	public fakeCategory: string = 'addgshgrtrtysidubv oaiv';

	public reacts: string[] = ['🤷', '😀', '😃', '😄', '😁', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '😍', '💨', '😘', '😗', '🍌', '🍑', '🍓', '😋'];

	public async runTests(): Promise<void> {
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa e l`,
			'No roles/categorys are currently set up',
			'List no reacts',
		);

		await this.runCommand(`${this.roleBot.globalConfig.prefixes.admin}sa c a ${this.categoryName}`);
		await this.runCommand(`${this.roleBot.globalConfig.prefixes.admin}sa c a ${this.secondCategoryName}`);

		await this.simpleTestList(
			`${this.roleBot.globalConfig.prefixes.admin}sa e l`,
			[
				{listTitle: this.categoryName, listValue: '- No self-assignable roles'},
				{},
				{listTitle: this.secondCategoryName, listValue: '- No self-assignable roles'},
			],
			'List reacts category overview no roles',
		);

		await this.simpleTestList(
			`${this.roleBot.globalConfig.prefixes.admin}sa e l ${this.categoryName}`,
			[{listTitle: this.categoryName, listValue: '- No self-assignable roles'}],
			'List reacts specific category no roles',
		);

		this.testingRole = await this.testServer.createRole({name: 'Honestly Whatever'});

		await this.runCommand(`${this.roleBot.globalConfig.prefixes.admin}sa r a r:{${this.testingRole.name}} c:{${this.categoryName}}`);

		await this.simpleTestList(
			`${this.roleBot.globalConfig.prefixes.admin}sa e l`,
			[{listTitle: this.categoryName, listValue: `- ${this.testingRole.name}, 0 react(s)`}],
			'List reacts w/ roles setup',
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa e l r:{${this.testingRole.name}} c:{${this.categoryName}}`,
			'This role does not have any reacts set up',
			'List reacts specifig category & role, no reacts',
		);

		await this.simpleTestDoubleResponse(
			`${this.roleBot.globalConfig.prefixes.admin}sa e a`,
			'``> enter role name``',
			'Could not add reaction role assignment; no role was given',
			'Adding react no role',
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa e a r:{${this.fakeRole}}`,
			`Could not add reaction role assignment; role \`\`${firstLetterUppercase(this.fakeRole)}\`\` does not exist`,
			'Adding react fake role',
		);

		await this.simpleTestDoubleResponse(
			`${this.roleBot.globalConfig.prefixes.admin}sa e a r:{${this.testingRole.name}}`,
			'``> enter category name``',
			'Could not add reaction role assignment; no category was given',
			'Adding react no category',
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa e a r:{${this.testingRole.name}} c:{${this.fakeCategory}}`,
			`Could not add reaction role assignment; category \`\`${firstLetterUppercase(this.fakeCategory)}\`\` does not exist`,
			'Adding react fake category',
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa e a r:{${this.testingRole.name}} c:{${this.secondCategoryName}}`,
			`Could not add reaction role assignment; role \`\`${this.testingRole.name}\`\` is not in category \`\`${firstLetterUppercase(this.secondCategoryName)}\`\``,
			'Adding react role not in category',
		);

		await this.simpleTestDoubleResponse(
			`${this.roleBot.globalConfig.prefixes.admin}sa e a r:{${this.testingRole.name}} c:{${this.categoryName}}`,
			'``> enter message link``',
			'Could not add reaction role assignment; no valid message link was given',
			'Adding react no message url',
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa e a r:{${this.testingRole.name}} c:{${this.categoryName}} HTTPS://DISCORDAPP.COM/CHANNELS/whatever`,
			'Could not add reaction role assignment; no valid message link was given',
			'Adding react invalid message url',
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa e a r:{${this.testingRole.name}} c:{${this.categoryName}} HTTPS://DISCORDAPP.COM/CHANNELS/guild/channel/message`,
			'Could not add reaction role assignment; message is not on this guild',
			'Adding react message url not on guild',
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa e a r:{${this.testingRole.name}} c:{${this.categoryName}} HTTPS://DISCORDAPP.COM/CHANNELS/${this.testServer.id}/channel/message`,
			'Could not add reaction role assignment; invalid channel, possibly lacking permissions',
			'Adding react message url not in channel',
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa e a r:{${this.testingRole.name}} c:{${this.categoryName}} HTTPS://DISCORDAPP.COM/CHANNELS/${this.testServer.id}/${this.testChannel.id}/message`,
			'Could not add reaction role assignment; invalid message',
			'Adding react invalid message id',
		);

		const message = await this.testChannel.send('Woo testing message!') as Message;

		for (let i = 0; i < this.reacts.length; i++) {
			await message.react(this.reacts[i]);
		}

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa e a r:{${this.testingRole.name}} c:{${this.categoryName}} ${message.url}`,
			'Could not add reaction role assignment; too many reacts on this message',
			'Adding react invalid message id',
		);

		this.testingMessage = await this.testChannel.send('Another testing message!') as Message;

		await this.simpleTestDoubleResponse(
			`${this.roleBot.globalConfig.prefixes.admin}sa e a r:{${this.testingRole.name}} c:{${this.categoryName}} ${this.testingMessage.url}`,
			'Please add the react for the role to this message',
			'Could not add reaction role assignment; no react was given',
			'Adding react, no emote',
			{time: 35000},
		);

		await this.addReactTest('Adding react');

		await this.simpleTestList(
			`${this.roleBot.globalConfig.prefixes.admin}sa e l`,
			[{listTitle: this.categoryName, listValue: `- ${this.testingRole.name}, 1 react(s)`}],
			'List reacts w/ roles + react',
		);

		await this.simpleTestList(
			`${this.roleBot.globalConfig.prefixes.admin}sa e l c:{${this.categoryName}} r:{${this.testingRole.name}}`,
			[
				{},
				{listTitle: '#1:', listValue: `Channel: ${this.testChannel.id}\nMessage: ${this.testingMessage.id}\nEmote: ${this.reacts[0]}\nLink: ${this.testingMessage.url}`},
			],
			'List reacts specified role and category',
		);

		await this.simpleTestDoubleResponse(
			`${this.roleBot.globalConfig.prefixes.admin}sa e r`,
			'``> enter category name``',
			'Could not remove reaction role assignment; no category was given',
			'Removing react no category',
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa e r c:{${this.fakeCategory}}`,
			`Could not remove reaction role assignment; category \`\`${firstLetterUppercase(this.fakeCategory)}\`\` does not exist`,
			'Removing react fake category',
		);

		await this.simpleTestDoubleResponse(
			`${this.roleBot.globalConfig.prefixes.admin}sa e r c:{${this.categoryName}}`,
			'``> enter role name``',
			'Could not remove reaction role assignment; no role was given',
			'Removing react no role',
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa e r c:{${this.categoryName}} r:{${this.fakeRole}}`,
			`Could not remove reaction role assignment; role \`\`${firstLetterUppercase(this.fakeRole)}\`\` does not exist`,
			'Removing react fake role',
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa e r c:{${this.secondCategoryName}} r:{${this.testingRole.name}}`,
			`Could not remove reaction role assignment; role \`\`${this.testingRole.name}\`\` is not in category \`\`${firstLetterUppercase(this.secondCategoryName)}\`\``,
			'Removing react role not in category',
		);

		await this.simpleTestDoubleResponse(
			`${this.roleBot.globalConfig.prefixes.admin}sa e r c:{${this.categoryName}} r:{${this.testingRole.name}}`,
			'``> enter indexes to remove``',
			'Could not remove reaction role assignment; no numbers of reacts to remove were given',
			'Removing react no indexes',
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa e r c:{${this.categoryName}} r:{${this.testingRole.name}} rm:{1}`,
			`Succesfully removed react(s) \`\`1\`\` from \`\`${this.testingRole.name}\`\` in category \`\`${firstLetterUppercase(this.categoryName)}\`\``,
			'Removing react',
		);
	}

	public cleanUp(): void {
		if (this.testingRole && this.testingRole.editable) {
			this.testingRole.delete();
		}
	}

	private async addReactTest(testCode: string): Promise<void> {
		const respondedMessage = await this.runCommand(`${this.roleBot.globalConfig.prefixes.admin}sa e a r:{${this.testingRole.name}} c:{${this.categoryName}} ${this.testingMessage.url}`) as Message;

		if (respondedMessage && respondedMessage.content === 'Please add the react for the role to this message') {
			respondedMessage.react(this.reacts[0]);
			const secondResponse = await this.testChannel.awaitMessages((message: Message) => message.member.id === this.roleBot.client.user.id, {max: 1, time: 15000});

			if (secondResponse && secondResponse.size > 0) {
				const res = secondResponse.first() as Message;

				if (res.content === 'Reaction role added') {
					this.completedTest(testCode);
					return;
				}
			}
		}

		this.failedTest(testCode);
	}
}
