import { BaseTest, UnitTest } from "@classes/base-test";
import { firstLetterUppercase } from "@core/functions";

export class SelfAssignCategoryTest extends BaseTest implements UnitTest {
	public name: string = 'Self Assign Category';
	public categoryName: string;
	public secondCategoryName: string;
	public newCategoryName: string;
	public fakeCategoryName: string;

	public async runTests() {
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa c`,
			'There are currently no self-assign categorys',
			'Listing no categorys'
		);
		
		await this.simpleTestDoubleResponse(
			`${this.roleBot.globalConfig.prefixes.admin}sa c a`,
			'``> enter a name for the category you want to create``',
			'Could not add category; no category name was given',
			'Adding no category name'
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa c a abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz`,
			'Could not add category; given category name is too long, max. 50 characters',
			'Adding 50+ char category name'
		);

		this.categoryName = 'TestCategory';
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa c a ${this.categoryName}`,
			`Added category \`\`${firstLetterUppercase(this.categoryName)}\`\``,
			'Adding category'
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa c a ${this.categoryName}`,
			`Could not add category; category \`\`${firstLetterUppercase(this.categoryName)}\`\` already exists`,
			'Adding category twice'
		);

		await this.simpleTestList(
			`${this.roleBot.globalConfig.prefixes.admin}sa c`,
			[{listTitle: 'Role Categorys', listValue: `- ${firstLetterUppercase(this.categoryName)}`}],
			'Category list'
		);

		await this.simpleTestDoubleResponse(
			`${this.roleBot.globalConfig.prefixes.admin}sa c c`,
			'``> enter the name of the category you want to change``',
			'Could not change category name; no current category name was given',
			'Changing category no old name'
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa c c on:{awd}`,
			'Could not change category name; category ``Awd`` does not exist',
			'Changing category non existing old name'
		);

		await this.simpleTestDoubleResponse(
			`${this.roleBot.globalConfig.prefixes.admin}sa c c on:{${this.categoryName}}`,
			'``> enter new name for category``',
			'Could not change category name; no new category name was given',
			'Changing category no new name'
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa c c on:{${this.categoryName}} nn:{abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz}`,
			'Could not change category name; given category name is too long, max. 50 characters',
			'Changing category new name 50+ chars'
		);

		this.secondCategoryName = 'othercategory';
		await this.runCommand(`${this.roleBot.globalConfig.prefixes.admin}sa c a ${this.secondCategoryName}`);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa c c on:{${this.categoryName}} nn:{${this.secondCategoryName}}`,
			`Could not change category name; category \`\`${firstLetterUppercase(this.secondCategoryName)}\`\` already exists`,
			'Changing category new name exists'
		);

		this.newCategoryName = 'newName';

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa c c on:{${this.categoryName}} nn:{${this.newCategoryName}}`,
			`Category \`\`${firstLetterUppercase(this.categoryName)}\`\` changed to \`\`${firstLetterUppercase(this.newCategoryName)}\`\``,
			'Changing category name'
		);

		await this.simpleTestList(
			`${this.roleBot.globalConfig.prefixes.admin}sa c`,
			[{listTitle: 'Role Categorys', listValue: `- ${firstLetterUppercase(this.newCategoryName)}\n- ${firstLetterUppercase(this.secondCategoryName)}`}],
			'List categories after swap'
		);

		await this.simpleTestDoubleResponse(
			`${this.roleBot.globalConfig.prefixes.admin}sa c s`,
			'``> enter the name of the first category``',
			'Could not swap categories; category 1 is missing',
			'Swapping category no 1st category'
		);

		this.fakeCategoryName = 'LolDoesnotExiST';
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa c s c1:{${this.fakeCategoryName}}`,
			`Could not swap categories; category \`\`${firstLetterUppercase(this.fakeCategoryName)}\`\` does not exist`,
			'Swapping category 1st category doesnt exist'
		);

		await this.simpleTestDoubleResponse(
			`${this.roleBot.globalConfig.prefixes.admin}sa c s c1:{${this.newCategoryName}}`,
			'``> enter the name of the second category``',
			'Could not swap categories; category 2 is missing',
			'Swapping category no 2nd category'
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa c s c1:{${this.newCategoryName}} c2:{${this.fakeCategoryName}}`,
			`Could not swap categories; category \`\`${firstLetterUppercase(this.fakeCategoryName)}\`\` does not exist`,
			'Swapping category 2nd category doesnt exist'
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa c s c1:{${this.newCategoryName}} c2:{${this.secondCategoryName}}`,
			`Swapped categories \`\`${firstLetterUppercase(this.newCategoryName)}\`\` and \`\`${firstLetterUppercase(this.secondCategoryName)}\`\``,
			'Swapping categories'
		);

		await this.simpleTestList(
			`${this.roleBot.globalConfig.prefixes.admin}sa c`,
			[{listTitle: 'Role Categorys', listValue: `- ${firstLetterUppercase(this.secondCategoryName)}\n- ${firstLetterUppercase(this.newCategoryName)}`}],
			'List categories after swap'
		);

		await this.simpleTestDoubleResponse(
			`${this.roleBot.globalConfig.prefixes.admin}sa c r`,
			'``> enter the name of the category you want to delete``',
			'Could not remove category; no category name was given',
			'Removing no category'
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa c r ${this.fakeCategoryName}`,
			`Could not remove category; category \`\`${firstLetterUppercase(this.fakeCategoryName)}\`\` does not exist`,
			'Removing invalid category'
		);

		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}sa c r ${this.newCategoryName}`,
			`Removed category \`\`${firstLetterUppercase(this.newCategoryName)}\`\``,
			'Removing category'
		);
	}
}