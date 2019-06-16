import { RoleBot } from '@core/bot-roles';
import { TestingBot } from '@core/bot-testing';
import { getBaseDir, loadDirs, loadFiles } from '@core/core-functions';
import { mainBotDirs, mainBotFiles } from '@core/defaults/main';
import { testingBotDirs, testingBotFiles } from '@core/defaults/testing';
import { readFileSync } from 'fs';

export function getRolebot(doFileChecks: boolean = true): RoleBot {
	if (doFileChecks) {
		loadDirs(mainBotDirs);
		loadFiles(mainBotFiles);
	}

	const baseDir = getBaseDir();

	return new RoleBot(readFileSync(baseDir + '/settings/tokens/main.txt').toString(), baseDir, {
		accentColor: readFileSync(baseDir + '/settings/accent-color.txt').toString(),
		dev: Boolean(readFileSync(baseDir + '/settings/dev.txt').toString()),
		developers: readFileSync(baseDir + '/settings/developers.txt').toString().split(','),
		prefixes: {
			admin: readFileSync(baseDir + '/settings/prefix-admin.txt').toString(),
			dev: readFileSync(baseDir + '/settings/prefix-dev.txt').toString(),
		},
		devServerId: readFileSync(baseDir + '/settings/server-dev.txt').toString(),
	});
}

export function getTestingBot(doFileChecks: boolean = true): TestingBot {
	if (doFileChecks) {
		loadDirs(mainBotDirs);
		loadFiles(mainBotFiles);

		loadDirs(testingBotDirs);
		loadFiles(testingBotFiles);
	}

	const baseDir = getBaseDir();

	return new TestingBot(readFileSync(baseDir + '/settings/tokens/testing.txt').toString(), baseDir);
}
