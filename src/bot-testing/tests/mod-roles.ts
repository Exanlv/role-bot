import { BaseTest, IUnitTest } from '@classes/base-test';
import { firstLetterUppercase } from '@core/functions';
import { Message, Role } from 'discord.js';

export class ModRolesTest extends BaseTest implements IUnitTest {
	public name: string = 'Mod Roles';
	public testRole: Role;

	public async runTests(): Promise<void> {
		/**
		 * Tests listing mod roles when there are no mod roles
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}mr`,
			'There are no mod-roles',
			'No mod roles list',
		);

		/**
		 * Role used for testing mod roles
		 */
		this.testRole = await this.testServer.createRole({name: 'AUTO-TEST-ROLE'});

		/**
		 * Tests adding a role as mod role
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}mr a ${this.testRole.name}`,
			`Added role \`\`${this.testRole.name}\`\` as mod-role`,
			'Adding mod role',
		);

		/**
		 * Tests adding a role as mod role twice
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}mr a ${this.testRole.name}`,
			`Could not add mod-role; role \`\`${this.testRole.name}\`\` is already a mod-role`,
			'Adding mod role',
		);

		/**
		 * Tests the mod role list
		 */
		await this.modRolesListTest('Mod roles list');

		/**
		 * Tests removing a modrole
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}mr r ${this.testRole.name}`,
			`Removed role \`\`${this.testRole.name}\`\` from mod-roles`,
			'Removing mod role',
		);

		/**
		 * Tests removing a modrole twice
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}mr r ${this.testRole.name}`,
			`Could not remove mod-role; role \`\`${this.testRole.name}\`\` is not a mod-role`,
			'Removing mod role',
		);

		/**
		 * Invalid role name
		 */
		const fakeRoleName = 'WhAtEVR-ThiS-ROlE-DoESNt-EXIST-LoL153';

		/**
		 * Tests adding a role that does not exist to mod roles
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}mr a ${fakeRoleName}`,
			`Could not add mod-role; role \`\`${firstLetterUppercase(fakeRoleName)}\`\` does not exist`,
			'Adding invalid role',
		);

		/**
		 * Tests removing a role that does not exist to mod roles
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}mr r ${fakeRoleName}`,
			`Could not remove mod-role; role \`\`${firstLetterUppercase(fakeRoleName)}\`\` does not exist`,
			'Removing invalid role',
		);

		/**
		 * Tests adding a mod role without giving a name
		 */
		await this.simpleTestDoubleResponse(
			`${this.roleBot.globalConfig.prefixes.admin}mr a`,
			'``> enter role name``',
			'Could not add mod-role; no role name was provided',
			'Add empty mod role',
		);

		/**
		 * Tests removing a mod role without giving a name
		 */
		await this.simpleTestDoubleResponse(
			`${this.roleBot.globalConfig.prefixes.admin}mr r`,
			'``> enter role name``',
			'Could not remove mod-role; no role name was provided',
			'Remove empty mod role',
		);
	}

	public async cleanUp(): Promise<void> {
		if (this.testRole) {
			await this.testRole.delete();
		}
	}

	private async modRolesListTest(testCode: string): Promise<void> {
		const message = await this.runCommand(`${this.roleBot.globalConfig.prefixes.admin}mr`) as Message;
		this.resultTest(testCode, !(typeof message === 'boolean' || (message as Message).embeds.length < 1 || (message as Message).embeds[0].fields[0].value !== `- ${this.testRole.name}`));
	}
}
