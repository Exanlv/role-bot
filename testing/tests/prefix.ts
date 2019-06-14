import { BaseTest, UnitTest } from "../base-test";

export class PrefixTest extends BaseTest implements UnitTest {
	public name: string = 'Prefix';
	
	public async runTests() {
		/**
		 * Get default prefix
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}p`,
			`Current prefix for ${this.testServer.name}: \`\`;;\`\``,
			'Get current prefix'
		);

		/**
		 * Set prefix to nothing
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}p s`,
			'Could not set prefix; no prefix was given',
			'Set no prefix'
		);

		/**
		 * Set prefix to empty string
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}p s p:{}`,
			'Could not set prefix; no prefix was given',
			'Set no prefix'
		);

		/**
		 * Set prefix to admin prefix
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}p s p:{${this.roleBot.globalConfig.prefixes.admin}}`,
			'Could not set prefix; this prefix can not be used',
			'Set prefix to admin prefix'
		);

		/**
		 * Set prefix to developer prefix
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}p s p:{${this.roleBot.globalConfig.prefixes.dev}}`,
			'Could not set prefix; this prefix can not be used',
			'Set prefix to dev prefix'
		);

		/**
		 * Set prefix to over max length
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}p s p:{abcdefghijklmnopqrstuvwxyz}`,
			'Could not set prefix; given prefix is too long',
			'Set prefix to 25+ chars'
		);

		/**
		 * Change prefix
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}p s p:{>:}`,
			'Prefix set!',
			'Setting prefix'
		);

		/**
		 * Check if prefix updated
		 */
		await this.simpleTest(
			`${this.roleBot.globalConfig.prefixes.admin}p`,
			`Current prefix for ${this.testServer.name}: \`\`>:\`\``,
			'Get updated prefix'
		);
	}
}