import { FileConfig } from "./classes/file";
import { FolderConfig } from "./classes/folder";

export const mainBotDirs: Array<FolderConfig> = [
	{
		path: '/data'
	},
	{
		path: '/data/configs'
	},
	{
		path: '/settings'
	},
	{
		path: '/settings/tokens'
	}
];

export const mainBotFiles: Array<FileConfig> = [
	{
		path: '/settings/dev.txt',
		defaultValue: 'true',
		required: true
	},
	{
		path: '/settings/prefix-admin.txt',
		defaultValue: '!rb',
		required: true
	},
	{
		path: '/settings/accent-color.txt',
		defaultValue: '$d',
		required: true
	},
	{
		path: '/settings/developers.txt',
		defaultValue: '',
		required: false
	},
	{
		path: '/settings/server-dev.txt',
		defaultValue: '',
		required: true,
		description: 'Server ID of (private) server the bot will use to output some stuff'
	},
	{
		path: '/settings/tokens/main.txt',
		defaultValue: '',
		required: true
	}
]