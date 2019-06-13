import { RoleBot } from './bot'
import { mainBotDirs, mainBotFiles } from './defaults/main';
import { loadDirs, loadFiles, getBaseDir } from './core';
import { readFileSync } from 'fs';

export function getRolebot(): RoleBot {
	loadDirs(mainBotDirs);
	loadFiles(mainBotFiles);

	const baseDir = getBaseDir();

	return new RoleBot(readFileSync(baseDir + '/settings/tokens/main.txt').toString(), baseDir, {
		accentColor: readFileSync(baseDir + '/settings/accent-color.txt').toString(),
		dev: Boolean(readFileSync(baseDir + '/settings/dev.txt').toString()),
		developers: readFileSync(baseDir + '/settings/developers.txt').toString().split(','),
		prefixes: {
			admin: readFileSync(baseDir + '/settings/prefix-admin.txt').toString(),
			dev: readFileSync(baseDir + '/settings/prefix-dev.txt').toString()
		},
		devServerId: readFileSync(baseDir + '/settings/server-dev.txt').toString()
	});
}