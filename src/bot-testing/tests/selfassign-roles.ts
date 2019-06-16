import { BaseTest, UnitTest } from "@classes/base-test";
import { firstLetterUppercase } from "@core/functions";
import { Role } from "discord.js";

export class SelfAssignRolesTest extends BaseTest implements UnitTest {
	public name: string = 'Self Assign Roles';

	public categoryName: string = 'TestingCategory';
	public secondCategoryName: string = 'OtherCategory';
	public testingRole: Role;
	public fakeRoleName: string = 'ThisRole~~doesntoexisto~~~~~';
	public fakeCategoryName: string = 'Honestly idk at this point';

	public async runTests() {
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa r l`,
			'No roles/category are currently set up',
			'List roles empty'
		);

		await this.runCommand(`${this.roleBot.globalConfig.prefixes.admin}sa c a ${this.categoryName}`);

		await this.simpleTestList(
			`${this.roleBot.globalConfig.prefixes.admin}sa r l`,
			[{listTitle: firstLetterUppercase(this.categoryName), listValue: 'No self-assignable roles'}],
			'List roles'
		);

		await this.runCommand(`${this.roleBot.globalConfig.prefixes.admin}sa c a ${this.secondCategoryName}`);

		await this.simpleTestList(
			`${this.roleBot.globalConfig.prefixes.admin}sa r l`,
			[
				{listTitle: firstLetterUppercase(this.categoryName), listValue: 'No self-assignable roles'},
				{},
				{listTitle: firstLetterUppercase(this.secondCategoryName), listValue: 'No self-assignable roles'}
			],
			'List roles multiple categories'
		);

		await this.simpleTestDoubleResponse(
			`${this.roleBot.globalConfig.prefixes.admin}sa r a`,
			'``> enter role name``',
			'Could not add self-assignable role; no role was given',
			'Adding no role'
		);

		
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa r a r:{${this.fakeRoleName}}`,
			`Could not add self-assignable role; role \`\`${firstLetterUppercase(this.fakeRoleName)}\`\` does not exist`,
			'Adding fake role'
		);

		this.testingRole = await this.testServer.createRole({name: 'Whatever'});

		await this.simpleTestDoubleResponse(
			`${this.roleBot.globalConfig.prefixes.admin}sa r a r:{${this.testingRole.name}}`,
			'``> enter category name``',
			'Could not add self-assignable role; no category was given',
			'Adding role no category'
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa r a r:{${this.testingRole.name}} c:{${this.fakeCategoryName}}`,
			`Could not add self-assignable role; category \`\`${firstLetterUppercase(this.fakeCategoryName)}\`\` does not exist`,
			'Adding role invalid category'
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa r a r:{${this.testingRole.name}} c:{${this.categoryName}}`,
			`Added role \`\`${this.testingRole.name}\`\` as self-assignable role in category \`\`${firstLetterUppercase(this.categoryName)}\`\``,
			'Adding role to category'
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa r a r:{${this.testingRole.name}} c:{${this.categoryName}}`,
			`Could not add self-assignable role; role \`\`${this.testingRole.name}\`\` already is in category \`\`${firstLetterUppercase(this.categoryName)}\`\``,
			'Adding role to category twice'
		);

		await this.simpleTestList(
			`${this.roleBot.globalConfig.prefixes.admin}sa r l`,
			[
				{listTitle: firstLetterUppercase(this.categoryName), listValue: `- ${this.testingRole.name}, 0 user(s)`},
				{},
				{listTitle: firstLetterUppercase(this.secondCategoryName), listValue: 'No self-assignable roles'}
			],
			'List roles w/ roles setup'
		);

		await this.testServer.members.find(m => m.id === this.client.user.id).addRole(this.testingRole);

		await this.simpleTestList(
			`${this.roleBot.globalConfig.prefixes.admin}sa r l`,
			[
				{listTitle: firstLetterUppercase(this.categoryName), listValue: `- ${this.testingRole.name}, 1 user(s)`},
				{},
				{listTitle: firstLetterUppercase(this.secondCategoryName), listValue: 'No self-assignable roles'}
			],
			'List roles w/ users per role'
		);

		await this.simpleTestDoubleResponse(
			`${this.roleBot.globalConfig.prefixes.admin}sa r r`,
			'``> enter role name``',
			'Could not remove self-assignable role; no role name was given',
			'Remove no role'
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa r r r:{${this.fakeRoleName}}`,
			`Could not remove self-assignable role; role \`\`${firstLetterUppercase(this.fakeRoleName)}\`\` does not exist`,
			'Remove fake role'
		);

		await this.simpleTestDoubleResponse(
			`${this.roleBot.globalConfig.prefixes.admin}sa r r r:{${this.testingRole.name}}`,
			'``> enter category name``',
			'Could not remove self-assignable role; no category name was given',
			'Removing role no category'
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa r r r:{${this.testingRole.name}} c:{${this.fakeCategoryName}}`,
			`Could not remove self-assignable role; category \`\`${firstLetterUppercase(this.fakeCategoryName)}\`\` does not exist`,
			'Removing role fake category'
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa r r r:{${this.testingRole.name}} c:{${this.secondCategoryName}}`,
			`Could not remove self-assignable role; role \`\`${this.testingRole.name}\`\` is not in \`\`${firstLetterUppercase(this.secondCategoryName)}\`\``,
			'Removing role not in category'
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa r r r:{${this.testingRole.name}} c:{${this.categoryName}}`,
			`Removed role \`\`${this.testingRole.name}\`\` from self-assignable roles in category \`\`${firstLetterUppercase(this.categoryName)}\`\``,
			'Removing role'
		);
	}

	public cleanUp() {
		if (this.testingRole && this.testingRole.editable) {
			this.testingRole.delete();
		}
	}
}