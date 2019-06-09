import { BaseTest, UnitTest } from "../base-test";
import { Role, Message } from "discord.js";
import { firstLetterUppercase } from '../../src/core/functions';

export class ModRolesTest extends BaseTest implements UnitTest {
	public name: string = 'Mod Roles'
	public testRole: Role;

	public async runTests() {
		/**
		 * Tests listing mod roles when there are no mod roles
		 */
		await this.simpleTest(
			'!rbt mr',
			'There are no mod-roles',
			'No mod roles list'
		);

		/**
		 * Role used for testing mod roles
		 */
		this.testRole = await this.testServer.createRole({name: 'AUTO-TEST-ROLE'});

		/**
		 * Tests adding a role as mod role
		 */
		await this.simpleTest(
			`!rbt mr a ${this.testRole.name}`,
			`Added role \`\`${this.testRole.name}\`\` as mod-role`,
			'Adding mod role'
		);

		/**
		 * Tests adding a role as mod role twice
		 */
		await this.simpleTest(
			`!rbt mr a ${this.testRole.name}`,
			`Could not add mod-role; role \`\`${this.testRole.name}\`\` is already a mod-role`,
			'Adding mod role'
		);

		/**
		 * Tests the mod role list
		 */
		await this.modRolesListTest('Mod roles list');

		/**
		 * Tests removing a modrole
		 */
		await this.simpleTest(
			`!rbt mr r ${this.testRole.name}`,
			`Removed role \`\`${this.testRole.name}\`\` from mod-roles`,
			'Removing mod role'
		)

		/**
		 * Tests removing a modrole twice
		 */
		await this.simpleTest(
			`!rbt mr r ${this.testRole.name}`,
			`Could not remove mod-role; role \`\`${this.testRole.name}\`\` is not a mod-role`,
			'Removing mod role'
		)

		/**
		 * Invalid role name
		 */
		const fakeRoleName = 'WhAtEVR-ThiS-ROlE-DoESNt-EXIST-LoL153';

		/**
		 * Tests adding a role that does not exist to mod roles
		 */
		await this.simpleTest(
			`!rbt mr a ${fakeRoleName}`,
			`Could not add mod-role; role \`\`${firstLetterUppercase(fakeRoleName)}\`\` does not exist`,
			'Adding invalid role'
		);

		/**
		 * Tests removing a role that does not exist to mod roles
		 */
		await this.simpleTest(
			`!rbt mr r ${fakeRoleName}`,
			`Could not remove mod-role; role \`\`${firstLetterUppercase(fakeRoleName)}\`\` does not exist`,
			'Removing invalid role'
		);

		/**
		 * Tests adding a mod role without giving a name
		 */
		await this.simpleTestDoubleResponse(
			'!rbt mr a',
			'``> enter role name``',
			'Could not add mod-role; no role name was provided',
			'Add empty mod role'
		);

		/**
		 * Tests removing a mod role without giving a name
		 */
		await this.simpleTestDoubleResponse(
			'!rbt mr r',
			'``> enter role name``',
			'Could not remove mod-role; no role name was provided',
			'Remove empty mod role'
		);
	}

	public async cleanUp() {
		if (this.testRole) {
			await this.testRole.delete();
		}
	}

	private async modRolesListTest(testCode) {
		const message = await this.runCommand('!rbt mr') as Message;
		this.resultTest(testCode, !(typeof message === "boolean" || (message as Message).embeds.length < 1 || (message as Message).embeds[0].fields[0].value !== `- ${this.testRole.name}`));
	}
}