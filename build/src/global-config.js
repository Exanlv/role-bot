"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GlobalConfig {
}
GlobalConfig.dev = process.arch === 'x64';
GlobalConfig.token = GlobalConfig.dev ? 'NTczMDY3MDczNzYxMzEyNzg3.XNHYyA.2YfNv0mPPMg76KbXiKAwRf6HFUk' : 'NTM0ODQwMTczNzM3ODAzODA2.Dx_cUg.pxQcRg9DVBzunPovzygCBTwpbpw';
GlobalConfig.adminPrefix = GlobalConfig.dev ? '!RBT ' : '!RB ';
GlobalConfig.basedir = __dirname;
GlobalConfig.dataDir = GlobalConfig.dev ? 'C:/Users/Max/Workspace/Typescript/bot/data' : '/home/pi/Bureaublad/data';
GlobalConfig.developers = ['178136842405675008'];
GlobalConfig.developerPrefix = GlobalConfig.dev ? '$DT ' : '$D ';
GlobalConfig.devServer = '575395886117421083';
exports.GlobalConfig = GlobalConfig;
