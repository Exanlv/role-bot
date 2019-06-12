"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./bot");
const fs_1 = require("fs");
const rootDir = (() => {
    let dir = __dirname.replace(/\\/g, '/').split('/');
    dir.splice(dir.length - 1, 1);
    return dir.join('/');
})();
const requiredDirs = [
    `${rootDir}/data`,
    `${rootDir}/data/configs`,
    `${rootDir}/tokens`
];
for (let i = 0; i < requiredDirs.length; i++) {
    if (!fs_1.existsSync(requiredDirs[i])) {
        console.log(`Created '${requiredDirs[i]}'`);
        fs_1.mkdirSync(requiredDirs[i]);
    }
}
if (!fs_1.existsSync(`${rootDir}/tokens/main.txt`)) {
    console.log(`Create '${rootDir}/tokens/main.txt' and shove the bot token in there`);
    process.exit();
}
new bot_1.RoleBot(fs_1.readFileSync(`${rootDir}/tokens/main.txt`).toString(), rootDir);
