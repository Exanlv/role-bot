"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_config_1 = require("../../global-config");
class List {
    constructor() {
        this.title = null;
        this.color = global_config_1.GlobalConfig.color;
        this.values = [];
        this.thumbnail = 'https://www.landviz.nl/host/logogrey-small.png';
    }
}
exports.List = List;
