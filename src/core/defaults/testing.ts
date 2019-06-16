import { FolderConfig } from "@classes/folder";
import { FileConfig } from "@classes/file";

export const testingBotDirs: Array<FolderConfig> = [

];

export const testingBotFiles: Array<FileConfig> = [
	{
		path: '/settings/tokens/testing.txt',
		defaultValue: '',
		required: true
	}
]