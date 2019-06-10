import { RoleBot } from "./bot";
import { readFileSync, existsSync, mkdirSync } from "fs";

const rootDir: string = `${__dirname}/..`.replace(/\\/g, '/');

const requiredDirs: Array<string> = [
	`${rootDir}/data`,
	`${rootDir}/data/configs`,
	`${rootDir}/tokens`
];

for (let i = 0; i < requiredDirs.length; i++) {
	if (!existsSync(requiredDirs[i])) {
		console.log(`Created '${requiredDirs[i]}'`);
		mkdirSync(requiredDirs[i]);
	}
}

if (!existsSync(`${rootDir}/tokens/main.txt`)) {
	console.log(`Create '${rootDir}/tokens/main.txt' and shove the bot token in there`);
	process.exit();
}

new RoleBot(readFileSync(`${rootDir}/tokens/main.txt`).toString(), rootDir);