"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function firstLetterUppercase(input) {
    return `${input.substring(0, 1).toUpperCase()}${input.substring(1).toLowerCase()}`;
}
exports.firstLetterUppercase = firstLetterUppercase;
