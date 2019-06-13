import { FileConfig } from './defaults/classes/file';
import { existsSync, writeFileSync, readFileSync, mkdirSync } from 'fs';
import { FolderConfig } from './defaults/classes/folder';

export function getBaseDir(): string {
	let dir = __dirname.replace(/\\/g, '/').split('/');
	dir.splice(dir.length - 1, 1);
	return dir.join('/');
}

export function loadDirs(dirs: Array<FolderConfig>): void {
	const baseDir = getBaseDir();
	for (let i = 0; i < dirs.length; i++) {
		if (!existsSync(baseDir + dirs[i].path)) {
			mkdirSync(baseDir + dirs[i].path);
		}
	}
}

export function loadFiles(files: Array<FileConfig>): void {
	const baseDir = getBaseDir();
	const missingFiles: Array<FileConfig> = [];

	for (let i = 0; i < files.length; i++) {
		if (!existsSync(baseDir + files[i].path)) {
			writeFileSync(baseDir + files[i].path, files[i].defaultValue);

			if (files[i].required && files[i].defaultValue === '') {
				missingFiles.push(files[i]);
			}
		} else {
			if (files[i].required && readFileSync(baseDir + files[i].path).toString() === '') {
				missingFiles.push(files[i]);
			}
		}
	}

	if (missingFiles.length) {
		console.log('Configure the following file(s):');
		for (let i = 0; i < missingFiles.length; i++) {
			console.log(`- ${missingFiles[i].path}${missingFiles[i].description ? `: ${missingFiles[i].description}` : ''}`)
		}
	}
}
