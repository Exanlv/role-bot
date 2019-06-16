export function sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export function firstLetterUppercase(input: string): string {
	return `${input.substring(0, 1).toUpperCase()}${input.substring(1).toLowerCase()}`;
}

export function limitLength(input: string, limit: number = 75) {
	return input.length > limit ? input.substr(0, limit) + '...' : input;
}