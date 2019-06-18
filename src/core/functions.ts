import { readFileSync } from "fs";

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve: any): any => setTimeout(resolve, ms) );
}

export function firstLetterUppercase(input: string): string {
	return `${input.substring(0, 1).toUpperCase()}${input.substring(1).toLowerCase()}`;
}

export function limitLength(input: string, limit: number = 75): string {
	return input.length > limit ? input.substr(0, limit) + '...' : input;
}

export function getFileValue(filePath): string {
	const val = readFileSync(filePath).toString();
	return val.endsWith('\n') ? val.substr(0, val.length - 2,) : val;
}
