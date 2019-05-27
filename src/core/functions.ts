export function firstLetterUppercase(input: string): string {
	return `${input.substring(0, 1).toUpperCase()}${input.substring(1).toLowerCase()}`;
}