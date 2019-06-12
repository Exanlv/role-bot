import { RoleBot } from "./bot";
import { readFileSync, existsSync, mkdirSync } from "fs";

const rootDir = (() => {
	let dir = __dirname.replace(/\\/g, '/').split('/');
	dir.splice(dir.length - 1, 1);
	return dir.join('/');
})();

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