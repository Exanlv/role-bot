"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GlobalConfig {
}
GlobalConfig.dev = process.arch === 'x64';
GlobalConfig.adminPrefix = GlobalConfig.dev ? '!RBT ' : '!RB ';
GlobalConfig.developers = ['178136842405675008', '583327931959607297'];
GlobalConfig.developerPrefix = GlobalConfig.dev ? '$DT ' : '$D ';
GlobalConfig.color = GlobalConfig.dev ? '#A50200' : '#008CFF';
GlobalConfig.devServer = '575395886117421083';
exports.GlobalConfig = GlobalConfig;
