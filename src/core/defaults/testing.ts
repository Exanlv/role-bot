import { FileConfig } from '@classes/file';
import { FolderConfig } from '@classes/folder';

export const testingBotDirs: FolderConfig[] = [

];

export const testingBotFiles: FileConfig[] = [
	{
		path: '/settings/tokens/testing.txt',
		defaultValue: '',
		required: true,
	},
];
