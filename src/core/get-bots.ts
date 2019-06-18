import { RoleBot } from '@core/bot-roles';
import { TestingBot } from '@core/bot-testing';
import { getBaseDir, loadDirs, loadFiles } from '@core/core-functions';
import { mainBotDirs, mainBotFiles } from '@core/defaults/main';
import { testingBotDirs, testingBotFiles } from '@core/defaults/testing';
import { readFileSync } from 'fs';
import { getFileValue } from './functions';

export function getRolebot(doFileChecks: boolean = true): RoleBot {
	if (doFileChecks) {
		loadDirs(mainBotDirs);
		loadFiles(mainBotFiles);
	}

	const baseDir = getBaseDir();

	return new RoleBot(getFileValue(baseDir + '/settings/tokens/main.txt'), baseDir, {
		accentColor: getFileValue(baseDir + '/settings/accent-color.txt'),
		dev: Boolean(getFileValue(baseDir + '/settings/dev.txt')),
		developers: getFileValue(baseDir + '/settings/developers.txt').split(','),
		prefixes: {
			admin: getFileValue(baseDir + '/settings/prefix-admin.txt'),
			dev: getFileValue(baseDir + '/settings/prefix-dev.txt'),
		},
		devServerId: getFileValue(baseDir + '/settings/server-dev.txt'),
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

	return new TestingBot(getFileValue(baseDir + '/settings/tokens/testing.txt'), baseDir);
}
